use std::fmt;

// Comments should remain readable and upright.
const THEME_NAME: &str = "Velune";
static ENABLED: bool = true;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ThemeMode {
    Dark,
    System,
}

/// A borrowed theme with a named lifetime.
#[derive(Debug)]
pub struct Theme<'a, const N: usize> {
    pub name: &'a str,
    pub accent: [u8; N],
    pub mode: ThemeMode,
}

pub trait Named {
    fn name(&self) -> &str;
}

impl<'a, const N: usize> Named for Theme<'a, N> {
    fn name(&self) -> &str {
        self.name
    }
}

impl<const N: usize> fmt::Display for Theme<'_, N> {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "Theme: {}\n", self.name)
    }
}

pub type ThemeResult<T> = Result<T, &'static str>;

macro_rules! theme_label {
    ($value:expr) => { format!("[{}]", $value) };
}

pub async fn load_theme<'a>(name: &'a str) -> ThemeResult<Theme<'a, 3>> {
    if name.is_empty() {
        return Err("Empty name");
    }
    Ok(Theme { name, accent: [225, 76, 111], mode: ThemeMode::Dark })
}

fn main() {
    let mut theme = Theme { name: THEME_NAME, accent: [225, 76, 111], mode: ThemeMode::Dark };
    let names = [THEME_NAME, "System"].map(|name| name.to_lowercase());
    let json = r#"{"theme":"Velune","dark":true}"#;
    let separator = '\n';
    let marker = 'v';
    if ENABLED && names.iter().any(|name| !name.is_empty()) {
        theme.mode = ThemeMode::System;
    }
    match theme.mode {
        ThemeMode::Dark => println!("{}", theme_label!(theme.name())),
        ThemeMode::System => println!("{json}{separator}{marker}"),
    }
}
