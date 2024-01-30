import { Directory, dag } from "../../sdk/client.gen.ts";
import { getDirectory } from "./lib.ts";

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

/**
 * @function
 * @description Run all tests
 * @param {string | Directory} src
 * @returns {string}
 */
export async function test(src: Directory | string = "."): Promise<string> {
  const context = await getDirectory(dag, src);

  // get MariaDB base image
  const mariadb = dag
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
    .withExposedPort(3306)
    .asService();

  const baseCtr = dag
    .pipeline(Job.test)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withMountedCache("/root/.pkgx", dag.cacheVolume("symfony-pkgx"))
    .withEnvVariable("COMPOSER_ALLOW_SUPERUSER", "1")
    .withExec([
      "pkgx",
      "install",
      "node@18.16.1",
      "classic.yarnpkg.com",
      "bun",
      "composer",
      "php",
      "git",
      "zip",
      "unzip",
    ]);

  const ctr = baseCtr
    .withMountedCache("/app/vendor", dag.cacheVolume("composer-vendor"))
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume("laravel-node_modules")
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withServiceBinding("db", mariadb)
    .withExec(["cp", ".env.example", ".env"])
    .withExec(["composer", "install", "--no-interaction"])
    .withExec(["npm", "install"])
    .withExec(["php", "artisan", "key:generate"])
    .withExec(["php", "artisan", "config:cache"])
    .withExec(["php", "artisan", "migrate"])
    .withExec(["php", "artisan", "db:seed"])
    .withExec(["php", "vendor/bin/phpunit"]);

  const result = await ctr.stdout();
  return result;
}

export type JobExec = (src?: Directory | string) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run all tests",
};
