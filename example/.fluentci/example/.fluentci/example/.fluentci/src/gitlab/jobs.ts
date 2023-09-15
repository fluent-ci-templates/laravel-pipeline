import { Job } from "fluent_gitlab_ci";

export const test = new Job().script(`
    php vendor/bin/phpunit --coverage-text --colors=never
    npm test
  `);
