import Client from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

export enum Job {
    test = "test",
}

export const test = async (client: Client, src = ".") => {
    const context = client.host().directory(src);

    // get MariaDB base image
    const mariadb = client
        .container()
        .from("mariadb:10.11.2")
        .withEnvVariable("MARIADB_USER", Deno.env.get("MARIADB_USER") || "user")
        .withEnvVariable(
            "MARIADB_PASSWORD",
            Deno.env.get("MARIADB_PASSWORD") || "password"
        )
        .withEnvVariable("MARIADB_DATABASE", "laravel")
        .withEnvVariable(
            "MARIADB_ROOT_PASSWORD",
            Deno.env.get("MARIADB_ROOT_PASSWORD") || "root"
        )
        .withExposedPort(3306);

    const baseCtr = withDevbox(
        client
            .pipeline(Job.test)
            .container()
            .from("alpine:latest")
            .withExec(["apk", "update"])
            .withExec(["apk", "add", "bash", "curl"])
            .withMountedCache("/nix", client.cacheVolume("nix"))
            .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
    );

    const ctr = baseCtr
        .withMountedCache("/app/vendor", client.cacheVolume("composer-vendor"))
        .withMountedCache(
            "/app/node_modules",
            client.cacheVolume("laravel-node_modules")
        )
        .withDirectory("/app", context, {
            exclude: ["vendor", "node_modules", ".git", ".fluentci", ".devbox"],
        })
        .withWorkdir("/app")
        .withServiceBinding("db", mariadb)
        .withExec(["cp", ".env.example", ".env"])
        .withExec([
            "sh",
            "-c",
            "devbox run -- composer install --no-interaction && \
       devbox run -- npm install",
        ])
        .withExec(["sh", "-c", "devbox run -- php artisan key:generate"])
        .withExec(["sh", "-c", "devbox run -- php artisan config:cache"])
        .withExec(["sh", "-c", "devbox run -- php artisan migrate"])
        .withExec(["sh", "-c", "devbox run -- php artisan db:seed"])
        .withExec(["sh", "-c", "devbox run -- php vendor/bin/phpunit"]);

    const result = await ctr.stdout();

    console.log(result);
};

export type JobExec = (client: Client, src?: string) => Promise<void>;

export const runnableJobs: Record<Job, JobExec> = {
    [Job.test]: test,
};

export const jobDescriptions: Record<Job, string> = {
    [Job.test]: "Run all tests",
};
