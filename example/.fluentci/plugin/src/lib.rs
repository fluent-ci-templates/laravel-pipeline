use extism_pdk::*;
use fluentci_pdk::dag;

use crate::helpers::setup_devbox;

pub mod helpers;

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    setup_devbox()?;

    let stdout = dag()
        .pipeline("test")?
        .devbox()?
        .with_exec(vec!["cp", ".env.test", ".env"])?
        .with_exec(vec!["devbox run -- composer install --no-interaction"])?
        .with_exec(vec!["devbox run -- npm install"])?
        .with_exec(vec!["devbox run -- php artisan key:generate"])?
        .with_exec(vec!["devbox run -- php artisan config:cache"])?
        .with_exec(vec!["devbox run -- php artisan migrate"])?
        .with_exec(vec!["devbox run -- php artisan db:seed"])?
        .with_exec(vec!["devbox run -- php vendor/bin/phpunit", &args])?
        .stdout()?;
    Ok(stdout)
}
