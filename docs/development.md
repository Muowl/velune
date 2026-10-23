# Development

## Build and package

Use Node.js 22 or later and npm. Dependencies are pinned in `package-lock.json`; CI uses the Node.js version in `.node-version`.

```sh
npm ci --ignore-scripts
npm run build
npm test
```

To create an installable extension:

```sh
npm run package
```

Packaging runs the build and tests automatically and writes `dist/velune-0.1.3.vsix`. The package includes the theme, icon, README, changelog and license; development scripts, fixtures and reports are excluded.

`npm run build:icon` regenerates the extension icon from `assets/velune-mark.svg`. The full build also exports 1024px PNG versions of the icon and transparent mark to `dist/`.

## Source layout

| Path | Purpose |
| --- | --- |
| `core/palette.json` | Source color values |
| `core/roles.json` | Color roles shared by the theme adapter |
| `scripts/build.mjs` | Maps the palette and roles to VS Code theme colors |
| `themes/velune-dark-color-theme.json` | Generated theme; do not edit directly |
| `core/resolved-tokens.json` | Generated color roles |
| `assets/velune-mark.svg` | Source artwork for the generated icon |
| `scripts/validate.mjs` | Theme, contrast, grammar and semantic contract checks |
| `tests/fixtures/` | Code samples for automated and visual checks |

Change source colors or the adapter, then rebuild and validate. Commit the updated generated files with the source changes. The current adapter produces VS Code themes; other formats would need their own adapters.

## Preview in an editor

After installing dependencies, open the repository in VS Code and press `F5`. The **Preview Velune** launch configuration builds the theme and opens an Extension Development Host with the sample files. Select **Velune Dark** using **Preferences: Color Theme**.

For Cursor, install the packaged VSIX from the Command Palette with **Extensions: Install from VSIX…**. If you are in the Agents Window, run **Open IDE** first. See [Cursor's theme controls](https://cursor.com/help/customization/themes).

Use a language extension compatible with your editor to inspect semantic highlighting. The theme supplies colors; it does not install language servers or compilers. Available extensions can differ between editors; see [Cursor's extension documentation](https://cursor.com/help/customization/extensions).

## Validation

`npm test` checks:

- Generated theme consistency, manifest constraints and workbench color IDs.
- TextMate tokenization with the pinned Shiki grammars for TypeScript, JavaScript, TSX, HTML, CSS, JSON, Python, Markdown, C#, C++, Rust and Java.
- Specific syntax colors for C#, C++, Rust and Java.
- Static semantic token contracts for C#, C/C++, clangd, rust-analyzer and Red Hat Java. Upstream declarations are recorded in [`tests/semantic-providers.json`](../tests/semantic-providers.json).
- Contrast across editor text, syntax, selections, search, Git diffs, interface text and terminal colors.

Outputs:

- [`docs/validation.json`](validation.json): check totals, contrast ratios and test limitations.
- `dist/token-preview.html` and [`docs/token-preview.html`](token-preview.html): the generated TextMate preview. Open either file in a browser after running the tests.

The **Validate Velune** workflow packages and tests pushes to `main` and pull requests. It checks that generated files are current and keeps the VSIX and validation artifacts for 30 days.

### Limits

The automated checks do not launch VS Code, Cursor or language servers. Semantic contracts check declared token mappings rather than live server output. Installed extensions may use different grammars from Shiki, and the sample files are tokenized rather than compiled.

Contrast checks cover the color pairs listed in the report. Overlapping decorations and additional UI states need visual review. ANSI black is intentionally excluded from the normal-text contrast threshold. These checks do not establish accessibility certification.

### Visual checks

Use your usual font and a real project alongside the fixtures:

1. Check comments and syntax colors during normal editing. Keywords should be lavender, functions blue, types pink, strings green and numbers amber. Variables and properties stay neutral.
2. Compare `editor.semanticHighlighting.enabled` set to `false` and `true`, then restore your preference. If a symbol looks wrong, run **Developer: Inspect Editor Tokens and Scopes** and record its semantic type, modifiers and TextMate scopes. See the [VS Code semantic highlighting guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide).
3. Check selections, repeated search matches and added or removed lines in Git diffs, including overlapping highlights.
4. Check suggestions, hover text, inlay hints, diagnostics, menus and keyboard focus. In Cursor, also inspect AI suggestions, change review and chat code blocks.
5. Run `python tests/fixtures/terminal-colors.py` in the integrated terminal to inspect ANSI colors.

When reporting a problem, include the editor and language extension versions, font, code sample, semantic highlighting setting and a screenshot. Token inspection details help distinguish a color rule from a language extension's classification.
