import Client from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

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
      .pipeline("test")
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
    .withExec([
      "sh",
      "-c",
      "eval $(devbox shell --print-env) && \
       php artisan key:generate && \
       php artisan config:cache && \
       php artisan migrate && \
       php artisan db:seed && \
       php vendor/bin/phpunit",
    ]);

  const result = await ctr.stdout();

  console.log(result);
};
