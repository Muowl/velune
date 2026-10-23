from dataclasses import dataclass

# Comments without automatic italics.
@dataclass(frozen=True)
class Theme:
    name: str
    dark: bool
    background: str


def alpha(value: float) -> float:
    """Clamp opacity to the range between zero and one."""
    return min(1, max(0, value))


theme = Theme(name="Velune", dark=True, background="#141119")
message = f"Theme {theme.name}: {alpha(0.8)}"
print(message)
