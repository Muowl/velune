import { useState } from "react";

interface ThemeCardProps {
  name: string;
  onSelect: (name: string) => void;
}

export function ThemeCard({ name, onSelect }: ThemeCardProps) {
  const [active, setActive] = useState(false);
  return (
    <button
      className="theme-card"
      aria-pressed={active}
      onClick={() => { setActive(true); onSelect(name); }}
    >
      <span>{name}</span>
      {active ? "Selecionado" : "Selecionar"}
    </button>
  );
}
