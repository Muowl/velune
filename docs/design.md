# Palette direction — 0.3.0

Version 0.2.0 softened the theme on Catppuccin's model, and the syntax became pastel: low-chroma colors at high lightness that blur together at a glance. This revision returns to the original brief, Evernight from Honkai: Star Rail, and borrows One Dark Pro's structure: a muted grey foreground with vivid, mid-lightness syntax colors that stand out from it.

## Source colors

The palette was sampled from Evernight's official artwork, then tuned in OKLCH so lightness and chroma could be controlled independently of hue:

- **Night indigo** from her portrait backdrops (hue ≈ 280–290) sets the surfaces and the selection band.
- **Black-violet** from her dress tints the editor, sidebars and chrome.
- **Orchid and lavender** from her hair become violet keywords, the cursor and the focus accent.
- **Rose and crimson** from her eyes and umbrella become rose types and the red used for errors.
- **White silk and silver** guide the cool, slightly violet grey of body text.

Green strings, amber numbers and cyan escapes don't appear in the artwork. They come from One Dark and complete the set of six hues the syntax roles need.

## Decisions

- Raise average syntax chroma from 0.059 to 0.117 OKLCH, the range One Dark Pro uses, while keeping lightness between 0.73 and 0.81. One Dark Pro's own keyword color fails this project's 4.5:1 rule on selection, so the colors are a little lighter than One Dark Pro's.
- Separate keywords (violet, hue 306) from types (rose, hue 8) by about 60° of hue. Those two roles sit next to each other constantly in Java, C# and Rust.
- Mute body text to `#C4C2D1`, which measures 8.88:1 against the editor. Like One Dark, a grey foreground leaves room for the syntax colors.
- Tint surfaces night-indigo: editor `#252230`, panels `#1F1D29`, chrome `#1A1823`. Selection is a saturated indigo, `#2F3154`, kept dark enough that every syntax color and the comment color stay above 4.5:1 on it.
- Keep comments upright and legible at `#A299B4`. They're brighter than One Dark's comments because they must also pass on selection, search and diff surfaces.
- Keep muted plum controls, independent of brand and diagnostic colors. Brand crimson `#E14C6F` remains reserved for the umbrella artwork.
- Derive ANSI terminal colors from the same hues so terminal output matches the editor.

## Measured changes

Ratios use sRGB relative luminance. Surface ratios describe visual prominence; they are not text accessibility scores.

| Pair | 0.2.0 | 0.3.0 |
| --- | ---: | ---: |
| Main text / editor | 10.57:1 | 8.88:1 |
| Primary button fill / sidebar | 1.75:1 | 1.72:1 |
| Primary button label / fill | 7.04:1 | 8.03:1 |
| Primary button label / hovered fill | 5.85:1 | 6.91:1 |
| Average syntax chroma (OKLCH) | 0.059 | 0.117 |

Tests require at least 4.5:1 for the checked text pairs and 3:1 for checked focus and boundary pairs. Project-specific upper bounds guard against bright body text and dominant button fills. The tightest pairs are comments on inserted diff text (4.58:1) and on selection (4.59:1). These bounds express this design choice, not a guarantee of comfort or an accessibility certification.

## Review

`npm test` generates [language samples](token-preview.html) and a [UI color study](ui-preview.html) from actual theme values. The UI study approximates layout; it isn't a VS Code capture.

The revision passed 431 checks across 12 TextMate grammars and 111 contrast pairs. TypeScript, Rust and Java samples were rendered beside 0.2.0 and One Dark Pro for comparison. No live VS Code, Cursor or language-server session was run for this revision. The final judgment requires everyday use in the user's editor, display and lighting.

## References

Consulted on 2026-11-20:

- One Dark Pro, as bundled with the pinned Shiki dependency
- [VS Code theme color reference](https://code.visualstudio.com/api/references/theme-color)
- [OKLCH color space](https://bottosson.github.io/posts/oklab/)
