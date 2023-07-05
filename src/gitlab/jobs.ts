import { Job } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";

export const test = new Job().script(`
    php vendor/bin/phpunit --coverage-text --colors=never
    npm test
  `);
