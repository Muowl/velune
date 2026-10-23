from dataclasses import dataclass

# Comentários sem itálico automático.
@dataclass(frozen=True)
class Theme:
    name: str
    dark: bool
    background: str


def alpha(value: float) -> float:
    """Limita a opacidade ao intervalo entre zero e um."""
    return min(1, max(0, value))


theme = Theme(name="Velune", dark=True, background="#141119")
message = f"Tema {theme.name}: {alpha(0.8)}"
print(message)
