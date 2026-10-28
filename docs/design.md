# Palette direction — 0.2.0

The first real-use feedback described the crimson sidebar buttons as too prominent and the overall theme as tiring over time. This revision reduces large-area contrast and color intensity while preserving the lavender, pink and blue syntax identity.

## Decisions

- Lift the editor from near-black `#141119` to a muted plum `#211E28`, with slightly darker sidebars and chrome. Raised surfaces remain a small step above the editor.
- Move ordinary text from `#E6DFEC` to `#D3CDDD`. Soften syntax and ANSI colors together, keeping distinct hues for the same language roles.
- Give controls their own palette: plum `#484057`, hover `#554B65`, label `#E0D7EC`. Buttons, badges and remote status no longer reuse the brand crimson. Hover no longer uses the error color.
- Use muted lavender for focus, cursor and active indicators. Explicit button borders and visible keyboard focus preserve discoverability despite quieter fills.
- Keep the original umbrella artwork and its crimson handle. Brand colors are independent of everyday interface controls.
- Keep comments legible, including selection, search and diff surfaces. Red remains available for actual errors and deleted code.

The inspiration is Catppuccin's hierarchy of base surfaces, secondary panes and overlays, with legibility taking priority. The palette values and language-role mappings remain Velune's own.

## Measured changes

Ratios use sRGB relative luminance. Surface ratios describe visual prominence; they are not text accessibility scores.

| Pair | 0.1.3 | 0.2.0 |
| --- | ---: | ---: |
| Main text / editor | 14.35:1 | 10.57:1 |
| Primary button fill / sidebar | 4.58:1 | 1.75:1 |
| Primary button label / fill | 4.86:1 | 7.04:1 |
| Primary button label / hovered fill | 7.27:1 | 5.85:1 |

Tests require at least 4.5:1 for the checked text pairs and 3:1 for checked focus/boundary pairs. Project-specific upper bounds guard against a return to dominant button fills or very bright body text. These bounds express this design choice, not a guarantee of comfort or an accessibility certification.

## Review

`npm test` generates [language samples](token-preview.html) and a [UI color study](ui-preview.html) using actual theme values. The latter shows normal, hover and keyboard-focus controls alongside selected text and diagnostics; it approximates layout rather than capturing VS Code.

The revision passed 431 checks across 12 TextMate grammars and 111 contrast pairs. The UI study was rendered at desktop and mobile widths, including hover and keyboard focus. No live VS Code, Cursor or language-server session was run for this revision. The final comfort judgment requires everyday use in the user's editor, display and lighting.

## References

Consulted on 2026-10-28:

- [Catppuccin style guide](https://github.com/catppuccin/catppuccin/blob/main/docs/style-guide.md)
- [VS Code theme color reference](https://code.visualstudio.com/api/references/theme-color)
