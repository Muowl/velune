// Tokens e estruturas comuns em TypeScript.
interface Theme {
  name: string;
  dark: boolean;
  background: string;
}

export const theme: Theme = {
  name: "Velune",
  dark: true,
  background: "#141119",
};

export function alpha(value: number): number {
  return Math.min(1, Math.max(0, value));
}

type Palette<T> = Readonly<Record<string, T>>;
const message = `Tema ${theme.name}: ${alpha(0.8)}`;
const hexPattern = /^#[0-9a-f]{6}$/i;
console.log(message, hexPattern.test(theme.background));
