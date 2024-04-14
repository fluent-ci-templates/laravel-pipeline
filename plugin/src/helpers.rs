use anyhow::Error;
use fluentci_pdk::dag;

pub fn setup_devbox() -> Result<(), Error> {
    dag()
        .devbox()?
        .with_exec(vec!["[ -f devbox.json ] || devbox init"])?
        .with_exec(vec![
            "grep -q 'php' devbox.json || devbox add mariadb@latest php@8.2 nodejs@18 redis@latest php81Packages.composer@latest"])?
        .stdout()?;
    Ok(())
}
