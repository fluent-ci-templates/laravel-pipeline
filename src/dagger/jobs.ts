import Client, { Container, Directory } from "@dagger.io/dagger";

export const test = async (client: Client, src: string) => {
  const ctr = setupPhp(
    client.pipeline("test").container().from("php:latest"),
    client.host().directory(src)
  ).withExec(["npm", "test"]);

  const result = await ctr.stdout();

  console.log(result);
};

const setupPhp = (ctr: Container, context: Directory): Container =>
  ctr
    .withDirectory("/app", context, {
      exclude: [".git", "node_modules", "vendor"],
    })
    .withExec(["apt-get", "update", "-yqq"])
    .withExec(["apt-get", "install", "gnupg", "-yqq"])
    .withExec([
      "curl",
      "-sL",
      "https://deb.nodesource.com/setup_8.x",
      "|",
      "bash",
      "-",
    ])
    .withExec([
      "apt-get",
      "install",
      "git",
      "nodejs",
      "libcurl4-gnutls-dev",
      "libicu-dev",
      "libmcrypt-dev",
      "libvpx-dev",
      "libjpeg-dev",
      "libpng-dev",
      "libxpm-dev",
      "zlib1g-dev",
      "libfreetype6-dev",
      "libxml2-dev",
      "libexpat1-dev",
      "libbz2-dev",
      "libgmp3-dev",
      "libldap2-dev",
      "unixodbc-dev",
      "libpq-dev",
      "libsqlite3-dev",
      "libaspell-dev",
      "libsnmp-dev",
      "libpcre3-dev",
      "libtidy-dev",
      "-yqq",
    ])
    .withExec([
      "php",
      "vendor/bin/phpunit",
      "--coverage-text",
      "--colors=never",
    ])
    .withExec([
      "docker-php-ext-install",
      "mbstring",
      "pdo_mysql",
      "curl",
      "json",
      "intl",
      "gd",
      "xml",
      "zip",
      "bz2",
      "opcache",
    ])
    .withExec(["pecl", "install", "xdebug"])
    .withExec(["docker-php-ext-enable", "xdebug"])
    .withExec(["curl", "-sS", "https://getcomposer.org/installer", "|", "php"])
    .withExec(["php", "composer.phar", "install"])
    .withExec(["npm", "install"])
    .withExec(["cp", ".env.testing", ".env"])
    .withExec(["npm", "run", "build"])
    .withExec(["npm", "run", "dev"])
    .withExec(["php", "artisan", "key:generate"])
    .withExec(["php", "artisan", "config:cache"])
    .withExec(["php", "artisan", "migrate"])
    .withExec(["php", "artisan", "db:seed"]);
