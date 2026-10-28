import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHighlighter } from 'shiki';
import { uiPreview } from './preview-ui.mjs';
import { root, palette, createTheme } from './build.mjs';

const theme = JSON.parse(await readFile(path.join(root, 'themes/velune-dark-color-theme.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const colorReference = JSON.parse(await readFile(path.join(root, 'tests/vscode-color-ids.json'), 'utf8'));
const checks = [];
const contrasts = [];
function check(name, condition) { assert.ok(condition, name); checks.push(name); }
check('Generated theme matches the palette and adapter', JSON.stringify(theme) === JSON.stringify(createTheme()));
check('Manifest contributes exactly the intended dark theme', manifest.contributes.themes.length === 1 && manifest.contributes.themes[0].uiTheme === 'vs-dark' && manifest.contributes.themes[0].label === 'Velune Dark');
check('No activation code or user settings', !manifest.main && !manifest.browser && !manifest.activationEvents && !manifest.contributes.configurationDefaults);
check('All workbench colors are valid hex values', Object.values(theme.colors).every(color => /^#[0-9A-F]{6}([0-9A-F]{2})?$/.test(color)));
check('All UI color IDs exist in the official reference snapshot', Object.keys(theme.colors).every(key => colorReference.ids.includes(key)));
check('Semantic highlighting is enabled', theme.semanticHighlighting === true);
check('All 16 terminal colors are defined', Object.keys(theme.colors).filter(key => key.startsWith('terminal.ansi')).length === 16);
check('Syntax roles keep distinct colors', new Set(Object.values(palette.syntax)).size === 6);
check('Comment style is upright', theme.tokenColors.find(rule => rule.name === 'Comments').settings.fontStyle === '' && theme.semanticTokenColors.comment.italic === false);
check('Executable-code rules have no bold or italic', theme.tokenColors.filter(rule => !rule.name.startsWith('Markdown')).every(rule => rule.settings.fontStyle === ''));

function rgb(hex) { return hex.slice(1, 7).match(/../g).map(value => parseInt(value, 16) / 255); }
function luminance(hex) { const [r, g, b] = rgb(hex).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; }
function composite(over, under) {
  if (over.length === 7) return over;
  const opacity = parseInt(over.slice(7), 16) / 255;
  return '#' + rgb(over).map((value, index) => Math.round(255 * (value * opacity + rgb(under)[index] * (1 - opacity))).toString(16).padStart(2, '0')).join('');
}
function ratio(a, b) { const [light, dark] = [luminance(a), luminance(b)].sort((a, b) => b - a); return (light + .05) / (dark + .05); }
function contrast(name, foreground, background, minimum = 4.5) {
  const value = ratio(foreground, background);
  contrasts.push({ name, foreground, background, ratio: Number(value.toFixed(4)), minimum });
  check(`${name}: ${value.toFixed(2)} >= ${minimum}`, value >= minimum);
}
const surfaces = {
  editor: palette.background.editor,
  selection: theme.colors['editor.selectionBackground'],
  currentLine: theme.colors['editor.lineHighlightBackground'],
  wordRead: composite(theme.colors['editor.wordHighlightBackground'], palette.background.editor),
  wordWrite: composite(theme.colors['editor.wordHighlightStrongBackground'], palette.background.editor),
  search: composite(theme.colors['editor.findMatchBackground'], palette.background.editor),
  inserted: composite(theme.colors['diffEditor.insertedTextBackground'], composite(theme.colors['diffEditor.insertedLineBackground'], palette.background.editor)),
  removed: composite(theme.colors['diffEditor.removedTextBackground'], composite(theme.colors['diffEditor.removedLineBackground'], palette.background.editor))
};
for (const [surface, color] of Object.entries(surfaces)) {
  for (const [role, foreground] of Object.entries({ text: palette.text.primary, comment: palette.text.comment, punctuation: palette.text.punctuation, ...palette.syntax })) contrast(`${role} on ${surface}`, foreground, color);
}
for (const surface of ['panel', 'elevated', 'hover', 'selection']) {
  contrast(`Primary UI text on ${surface}`, palette.text.primary, palette.background[surface]);
  contrast(`Secondary UI text on ${surface}`, palette.text.secondary, palette.background[surface]);
}
for (const [name, foreground, background] of [
  ['Button label', 'button.foreground', 'button.background'],
  ['Hovered button label', 'button.foreground', 'button.hoverBackground'],
  ['Secondary button label', 'button.secondaryForeground', 'button.secondaryBackground'],
  ['Hovered secondary button label', 'button.secondaryForeground', 'button.secondaryHoverBackground'],
  ['Badge label', 'badge.foreground', 'badge.background'],
  ['Activity badge label', 'activityBarBadge.foreground', 'activityBarBadge.background'],
  ['Remote indicator label', 'statusBarItem.remoteForeground', 'statusBarItem.remoteBackground']
]) contrast(name, theme.colors[foreground], theme.colors[background]);
// Design bounds prevent regressions to bright filled controls and near-white text.
// These are project choices, not a measure or guarantee of eye comfort.
check('Body text uses moderate contrast', ratio(theme.colors['editor.foreground'], theme.colors['editor.background']) >= 7 && ratio(theme.colors['editor.foreground'], theme.colors['editor.background']) <= 12);
for (const surface of ['editor.background', 'sideBar.background', 'editorWidget.background']) {
  for (const control of ['button.background', 'button.hoverBackground', 'badge.background', 'activityBarBadge.background']) {
    check(`${control} remains restrained on ${surface}`, ratio(theme.colors[control], theme.colors[surface]) < 2.8);
  }
  contrast(`Keyboard focus on ${surface}`, theme.colors.focusBorder, theme.colors[surface], 3);
}
contrast('Button boundary on sidebar', theme.colors['button.border'], theme.colors['sideBar.background'], 3);
check('Routine controls do not use diagnostic or brand fills', ['button.background', 'button.hoverBackground', 'badge.background', 'activityBarBadge.background'].every(key => ![palette.brand.accent, palette.state.error].includes(theme.colors[key])));
for (const [role, color] of Object.entries(palette.state)) contrast(`${role} diagnostic`, color, palette.background.editor);
for (const [role, color] of Object.entries(palette.terminal)) {
  // ANSI black is intentionally a dark base color, not an accessible normal-text choice.
  if (role !== 'black') contrast(`ANSI ${role}`, color, palette.background.editor);
}
for (const key of ['editor.inactiveSelectionBackground', 'editor.selectionHighlightBackground', 'editor.wordHighlightBackground', 'editor.wordHighlightStrongBackground', 'editor.findMatchBackground', 'diffEditor.insertedTextBackground', 'diffEditor.removedTextBackground']) check(`${key} preserves underlying decorations`, theme.colors[key].length === 9 && !theme.colors[key].endsWith('FF'));
const mapping = { function: palette.syntax.function, method: palette.syntax.function, class: palette.syntax.type, type: palette.syntax.type, keyword: palette.syntax.keyword, string: palette.syntax.string, number: palette.syntax.number, comment: palette.text.comment, variable: palette.text.primary, property: palette.text.primary };
for (const [token, color] of Object.entries(mapping)) check(`Semantic mapping: ${token}`, theme.semanticTokenColors[token].foreground === color);

const fixtures = [
  ['typescript', 'theme.ts'], ['javascript', 'example.js'], ['tsx', 'component.tsx'],
  ['csharp', 'theme.cs'], ['cpp', 'theme.cpp'],
  ['rust', 'theme.rs'], ['java', 'ThemePreview.java'],
  ['html', 'index.html'], ['css', 'styles.css'], ['json', 'settings.json'], ['python', 'theme.py'], ['markdown', 'readme.md']
];
const highlighter = await createHighlighter({ themes: [{ ...theme, name: 'velune' }], langs: fixtures.map(([lang]) => lang) });
const rendered = [], tokenized = new Map();
for (const [lang, file] of fixtures) {
  const source = await readFile(path.join(root, 'tests/fixtures', file), 'utf8');
  const result = highlighter.codeToTokens(source, { lang, theme: 'velune' });
  check(`${lang}: tokenization preserves all source text`, result.tokens.map(line => line.map(token => token.content).join('')).join('\n') === source);
  check(`${lang}: produces distinct token colors`, new Set(result.tokens.flat().filter(token => token.content.trim()).map(token => token.color)).size >= (lang === 'json' ? 3 : 4));
  if (lang !== 'markdown') check(`${lang}: no unexpected bold or italic`, result.tokens.flat().every(token => !((token.fontStyle || 0) & 3)));
  tokenized.set(lang, { source, result });
  rendered.push(`<section><h2>${file}</h2>${highlighter.codeToHtml(source, { lang, theme: 'velune' })}</section>`);
}
function tokenAt(lang, anchor, offset, expected) {
  const { source, result } = tokenized.get(lang);
  const start = source.indexOf(anchor);
  assert.ok(start >= 0, `Missing anchor: ${anchor}`);
  const position = start + offset;
  const before = source.slice(0, position).split('\n');
  const line = before.length - 1, column = before.at(-1).length;
  let cursor = 0;
  const token = result.tokens[line].find(token => { const matches = cursor <= column && cursor + token.content.length > column; cursor += token.content.length; return matches; });
  check(`${lang}: ${anchor} resolves to ${expected}`, token?.color?.toUpperCase() === expected);
}
tokenAt('typescript', 'interface Theme', 0, palette.syntax.keyword);
tokenAt('typescript', 'interface Theme', 10, palette.syntax.type);
tokenAt('typescript', 'function alpha', 9, palette.syntax.function);
tokenAt('typescript', '"Velune"', 2, palette.syntax.string);
tokenAt('typescript', 'dark: true', 6, palette.syntax.number);
tokenAt('typescript', '// Tokens', 4, palette.text.comment);
tokenAt('javascript', 'function loadTheme', 9, palette.syntax.function);
tokenAt('javascript', 'const theme', 6, palette.text.primary);
tokenAt('tsx', 'className="theme-card"', 0, palette.syntax.type);
tokenAt('tsx', '<button', 1, palette.syntax.keyword);
tokenAt('html', '<main class', 1, palette.syntax.keyword);
tokenAt('css', 'padding: 16px', 0, palette.text.primary);
tokenAt('json', '"name"', 2, palette.syntax.type);
tokenAt('json', '"Velune"', 2, palette.syntax.string);
tokenAt('python', 'def alpha', 4, palette.syntax.function);
tokenAt('python', 'class Theme', 6, palette.syntax.type);
tokenAt('python', '# Comments', 4, palette.text.comment);
// Real grammar regressions: specific symbols, not just the number of colors.
const languageCases = JSON.parse(await readFile(path.join(root, 'tests/language-cases.json'), 'utf8'));
const paletteColor = colorRole => colorRole.split('.').reduce((object, key) => object[key], palette);
for (const [language, cases] of Object.entries(languageCases)) {
  for (const [anchor, symbol, colorRole] of cases) {
    const offset = anchor.indexOf(symbol);
    assert.ok(offset >= 0, `Missing symbol ${symbol} in ${anchor}`);
    tokenAt(language, anchor, offset, paletteColor(colorRole));
  }
}

// Static contracts from upstream declarations, not an LSP integration test or
// an implementation of the editor's complete semantic-style resolver.
const providers = JSON.parse(await readFile(path.join(root, 'tests/semantic-providers.json'), 'utf8')).providers;
const providerCases = {
  csharp: {
    recordClass: 'syntax.type', recordStruct: 'syntax.type', delegate: 'syntax.type',
    field: 'text.primary', constant: 'text.primary', extensionMethod: 'syntax.function',
    controlKeyword: 'syntax.keyword', stringVerbatim: 'syntax.string', stringEscapeCharacter: 'syntax.escape',
    operatorOverloaded: 'text.punctuation', punctuation: 'text.punctuation', excludedCode: 'text.comment',
    ...Object.fromEntries(providers.find(p => p.id === 'csharp').types.filter(t => t.id.startsWith('xmlDocComment')).map(t => [t.id, 'text.comment']))
  },
  cpptools: {
    templateType: 'syntax.type', templateFunction: 'syntax.function', referenceType: 'syntax.type',
    genericType: 'syntax.type', valueType: 'syntax.type', cliProperty: 'text.primary',
    operatorOverload: 'text.punctuation', memberOperatorOverload: 'text.punctuation',
    newOperator: 'text.punctuation', customLiteral: 'syntax.number', numberLiteral: 'syntax.number', stringLiteral: 'syntax.string'
  },
  clangd: { concept: 'syntax.type', modifier: 'syntax.keyword', bracket: 'text.punctuation', unknown: 'text.primary', typeParameter: 'syntax.type', macro: 'syntax.function', enumMember: 'syntax.number', property: 'text.primary' },
  'rust-analyzer': {
    attribute: 'syntax.type', builtinAttribute: 'syntax.type', derive: 'syntax.type', deriveHelper: 'syntax.type',
    toolModule: 'syntax.type', boolean: 'syntax.number', builtinType: 'syntax.type', character: 'syntax.string',
    constParameter: 'text.primary', const: 'text.primary', static: 'text.primary', lifetime: 'syntax.type',
    escapeSequence: 'syntax.escape', formatSpecifier: 'syntax.escape', invalidEscapeSequence: 'state.error',
    punctuation: 'text.punctuation', macroBang: 'syntax.function', selfKeyword: 'text.primary',
    selfTypeKeyword: 'syntax.type', unresolvedReference: 'text.primary',
    angle: 'text.punctuation', attributeBracket: 'text.punctuation', brace: 'text.punctuation',
    bracket: 'text.punctuation', colon: 'text.punctuation', comma: 'text.punctuation', dot: 'text.punctuation',
    parenthesis: 'text.punctuation', semicolon: 'text.punctuation',
    procMacro: 'syntax.function', arithmetic: 'text.punctuation', typeAlias: 'syntax.type', union: 'syntax.type'
  },
  java: { annotation: 'syntax.type', annotationMember: 'text.primary', modifier: 'syntax.keyword', record: 'syntax.type', recordComponent: 'text.primary' }
};
for (const provider of providers) {
  for (const [token, colorRole] of Object.entries(providerCases[provider.id])) {
    const declaration = provider.types.find(t => t.id === token);
    assert.ok(declaration, `Unknown ${provider.id} token: ${token}`);
    const style = theme.semanticTokenColors[`${token}:${provider.language}`] ?? theme.semanticTokenColors[token] ?? theme.semanticTokenColors[declaration.superType];
    check(`${provider.id} static contract: ${token}`, style?.foreground === paletteColor(colorRole) && style.italic === false && style.bold === false);
  }
}
check('clangd constructors retain the callable color', theme.semanticTokenColors['*.constructorOrDestructor:cpp'].foreground === palette.syntax.function);
check('Deprecated symbols retain strikethrough', theme.semanticTokenColors['*.deprecated'].strikethrough === true);
check('Java constructors retain the callable color', theme.semanticTokenColors['*.constructor:java'].foreground === palette.syntax.function);
check('Java documentation tokens retain the comment color', theme.semanticTokenColors['*.documentation:java'].foreground === palette.text.comment);
check('Rust mutable symbols do not receive underline', theme.semanticTokenColors['*.mutable:rust'].underline === false);
const workbenchPreview = uiPreview(theme, highlighter.codeToHtml(await readFile(path.join(root, 'tests/fixtures/theme.ts'), 'utf8'), { lang: 'typescript', theme: 'velune' }));
highlighter.dispose();
await mkdir(path.join(root, 'dist'), { recursive: true });
await mkdir(path.join(root, 'docs'), { recursive: true });
const report = { version: manifest.version, checks: checks.length, languages: fixtures.map(([lang]) => lang), contrasts, semanticContracts: { kind: 'static declarations, not live LSP output', providers: providers.map(provider => provider.id), cases: Object.values(providerCases).reduce((sum, cases) => sum + Object.keys(cases).length, 0) }, limits: ['No live VS Code, Cursor session or language-server integration was run.', 'TextMate grammars are supplied by the pinned Shiki dependency; installed VS Code extensions may use different grammars.', 'Overlapping selection, search and diff decorations still need visual evaluation in the editor.', 'ANSI black is deliberately exempt from the normal-text contrast threshold.'] };
await writeFile(path.join(root, 'docs/validation.json'), JSON.stringify(report, null, 2) + '\n');
const preview = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Velune — syntax preview</title><style>body{margin:0;background:${palette.background.editor};color:${palette.text.primary};font:15px/1.6 system-ui}main{max-width:1040px;margin:auto;padding:24px}h1,h2{font-weight:500}h2{font-size:16px;color:${palette.text.secondary}}section{margin:28px 0}pre{padding:20px;border:1px solid ${palette.border.subtle};border-radius:8px;overflow:auto;font:14px/1.7 Consolas,monospace}header{border-bottom:2px solid ${palette.interaction.accent};padding-bottom:12px}</style><main><header><h1>Velune Dark</h1><p>TextMate syntax preview generated with Shiki. This is not an editor screenshot.</p></header>${rendered.join('')}</main></html>`;
await writeFile(path.join(root, 'dist/token-preview.html'), preview);
await writeFile(path.join(root, 'docs/token-preview.html'), preview);
await writeFile(path.join(root, 'dist/ui-preview.html'), workbenchPreview);
await writeFile(path.join(root, 'docs/ui-preview.html'), workbenchPreview);
console.log(`Passed ${checks.length} checks; ${contrasts.length} contrast pairs; ${fixtures.length} real TextMate grammars.`);
