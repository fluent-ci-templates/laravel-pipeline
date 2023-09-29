# Laravel Pipeline

[![deno module](https://shield.deno.dev/x/laravel_pipeline)](https://deno.land/x/laravel_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/laravel-pipeline)](https://codecov.io/gh/fluent-ci-templates/laravel-pipeline)

A ready-to-use Pipeline for your Laravel projects.

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci laravel_pipeline
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

## Jobs

| Job       | Description   |
| --------- | ------------- |
| test      | Run tests     |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import Client, { connect } from "@dagger.io/dagger";
import { Dagger } from "https://deno.land/x/laravel_pipeline/mod.ts";

const { test } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
  });
}

pipeline();
```
