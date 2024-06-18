# Laravel Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/laravel_pipeline)](https://pkg.fluentci.io/laravel_pipeline)
[![deno module](https://shield.deno.dev/x/laravel_pipeline)](https://deno.land/x/laravel_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.42)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/laravel)](https://jsr.io/@fluentci/laravel)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/laravel-pipeline)](https://codecov.io/gh/fluent-ci-templates/laravel-pipeline)

A ready-to-use Pipeline for your Laravel projects.

## 🚀 Usage

Run the following command in your project:

```bash
fluentci run laravel_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t laravel
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

## Environment variables

| Variable               | Description                                | Default |
| ---------------------- | ------------------------------------------ | ------------- |
|`MARIADB_USER`          | The username for the MariaDB database      | `user`        |
|`MARIADB_PASSWORD`      | The password for the MariaDB database      | `password`    |
|`MARIADB_ROOT_PASSWORD` | The root password for the MariaDB database | `root`        |

## Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger mod install github.com/fluent-ci-templates/laravel-pipeline@mod
```

## Jobs

| Job       | Description   |
| --------- | ------------- |
| test      | Run tests     |

```graphql
test(src?: Directory | string): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "jsr:@fluentci/laravel";

await test(".");

```
