#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Velune.Preview;

// Comments should remain readable and upright.
public enum ThemeMode { Dark, System }
public readonly record struct Accent(byte Red, byte Green, byte Blue);
public sealed record Theme(string Name, Accent Accent, ThemeMode Mode);
public delegate string ThemeFormatter(Theme theme);

public interface IThemeStore<T> where T : class
{
    Task<T?> FindAsync(string name, CancellationToken cancellationToken);
}

/// <summary>Loads a theme without changing editor preferences.</summary>
public sealed class ThemeService(IThemeStore<Theme> store)
{
    private const int RetryLimit = 3;
    public event Action<Theme>? Changed;
    public string Name { get; private set; } = "Velune";

    [Obsolete("Use LoadAsync instead.")]
    public string Describe() => $"Theme: {Name}\n";

    public async Task<Theme?> LoadAsync(CancellationToken cancellationToken = default)
    {
        var path = @"C:\Themes\Velune";
        var json = """{"theme":"Velune","dark":true}""";
        for (var attempt = 0; attempt < RetryLimit; attempt++)
        {
            var theme = await store.FindAsync(Name, cancellationToken);
            if (theme is { Mode: ThemeMode.Dark })
            {
                Name = theme.Name;
                Changed?.Invoke(theme);
                Console.WriteLine($"{path}: {json}; {theme.Name}");
                return theme;
            }
        }
        return null;
    }
}

public static class ThemeExtensions
{
    public static IEnumerable<string> Names(this IEnumerable<Theme> themes) =>
        themes.Select(theme => theme.Name);
}

#if DEBUG
internal static class Diagnostics { public const bool Enabled = true; }
#endif
