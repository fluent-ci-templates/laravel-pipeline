# Laravel Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Flaravel_pipeline&query=%24.version)](https://pkg.fluentci.io/laravel_pipeline)
[![deno module](https://shield.deno.dev/x/laravel_pipeline)](https://deno.land/x/laravel_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
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

## Jobs

| Job       | Description   |
| --------- | ------------- |
| test      | Run tests     |

```graphql
test(src: String!): String
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "https://pkg.fluentci.io/laravel_pipeline@v0.6.0/mod.ts";

await test(".");

```
