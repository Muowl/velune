package velune.preview;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

// Comments should remain readable and upright.
public final class ThemePreview {
    private static final String THEME_NAME = "Velune";
    private static final boolean ENABLED = true;

    public enum ThemeMode { DARK, SYSTEM }
    public record Accent(int red, int green, int blue) {}
    public record Theme(String name, Accent accent, ThemeMode mode) {}

    public interface ThemeStore<T> {
        Optional<T> find(String name);
    }

    /**
     * Returns the theme label.
     * @param theme the selected theme
     * @return a readable name
     * @see Theme
     */
    @Deprecated(since = "0.1", forRemoval = false)
    public static String describe(Theme theme) {
        return "Theme: " + theme.name() + "\n";
    }

    @SafeVarargs
    private static <T> List<T> entries(T... values) {
        return List.of(values);
    }

    public static void main(String[] args) {
        var theme = new Theme(THEME_NAME, new Accent(225, 76, 111), ThemeMode.DARK);
        Function<Theme, String> label = value -> value.name().toLowerCase();
        var names = entries(theme).stream().map(Theme::name).toList();
        Optional<? extends Theme> selected = Optional.of(theme);
        var json = """
                {"theme":"Velune","dark":true}
                """;
        char marker = 'v';
        var mode = switch (theme.mode()) {
            case DARK -> "dark";
            case SYSTEM -> "system";
        };
        if (ENABLED && !names.isEmpty() && selected.isPresent()) {
            System.out.println(label.apply(theme) + json + marker + mode);
        }
    }
}
