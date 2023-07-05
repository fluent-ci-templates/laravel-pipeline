# Laravel Pipeline

[![deno module](https://shield.deno.dev/x/laravel_pipeline)](https://deno.land/x/laravel_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/laravel-pipeline)](https://codecov.io/gh/fluent-ci-templates/laravel-pipeline)

A ready-to-use GitLab CI Pipeline and Jobs for your Laravel projects.

## 🚀 Usage

Quick start:

```ts
import { GitLab } from "https://deno.land/x/laravel_pipeline/mod.ts";

const { pipeline } = GitLab;

pipeline.write(); // Write the pipeline to the file .gitlab-ci.yml
```

It will create a `.gitlab-ci.yml` file with the following content:

```yaml
# Do not edit this file directly. It is generated by Fluent GitLab CI

image: php:latest

services:
  - mysql:latest

variables:
  MYSQL_DATABASE: project_name
  MYSQL_ROOT_PASSWORD: secret

cache:
  paths:
    - vendor/
    - node_modules/

before_script:
  - apt-get update -yqq
  - apt-get install gnupg -yqq
  - curl -sL https://deb.nodesource.com/setup_8.x | bash -
  - apt-get install git nodejs libcurl4-gnutls-dev libicu-dev libmcrypt-dev libvpx-dev libjpeg-dev libpng-dev libxpm-dev zlib1g-dev libfreetype6-dev libxml2-dev libexpat1-dev libbz2-dev libgmp3-dev libldap2-dev unixodbc-dev libpq-dev libsqlite3-dev libaspell-dev libsnmp-dev libpcre3-dev libtidy-dev -yqq
  - docker-php-ext-install mbstring pdo_mysql curl json intl gd xml zip bz2 opcache
  - pecl install xdebug
  - docker-php-ext-enable xdebug
  - curl -sS https://getcomposer.org/installer | php
  - php composer.phar install
  - npm install
  - cp .env.testing .env
  - npm run build
  - npm run dev
  - php artisan key:generate
  - php artisan config:cache
  - php artisan migrate
  - php artisan db:seed

test:
  script:
    - php vendor/bin/phpunit --coverage-text --colors=never
    - npm test
```