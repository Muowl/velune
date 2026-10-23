// Functions, operators, templates and regular expressions.
export async function loadTheme(name = "Velune") {
  const theme = { name, dark: true, opacity: 0.8 };
  const isValid = /^#[0-9a-f]{6}$/i.test("#141119");
  return { ...theme, isValid, label: `Theme ${name}` };
}

loadTheme().then(theme => console.log(theme.name));
