import Client, { connect } from "../../deps.ts";

export enum Job {
  test = "test",
}

export const exclude = [
  "vendor",
  "node_modules",
  ".git",
  ".fluentci",
  ".devbox",
];

export const test = async (src = "."): Promise<string> => {
  await connect(async (client: Client) => {
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

    const baseCtr = client
      .pipeline(Job.test)
      .container()
      .from("ghcr.io/fluentci-io/devbox:latest")
      .withExec(["mv", "/nix/store", "/nix/store-orig"])
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"]);

    const ctr = baseCtr
      .withMountedCache("/app/vendor", client.cacheVolume("composer-vendor"))
      .withMountedCache(
        "/app/node_modules",
        client.cacheVolume("laravel-node_modules")
      )
      .withDirectory("/app", context, { exclude })
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
  });
  return "done";
};

export type JobExec = (src?: string) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run all tests",
};
