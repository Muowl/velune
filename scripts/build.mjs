import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const root = fileURLToPath(new URL('../', import.meta.url));
export const palette = JSON.parse(await readFile(path.join(root, 'core/palette.json'), 'utf8'));
const roles = JSON.parse(await readFile(path.join(root, 'core/roles.json'), 'utf8'));
export function role(name) {
  if (!roles[name]) throw new Error(`Unknown semantic role: ${name}`);
  const value = roles[name].split('.').reduce((object, key) => object?.[key], palette);
  if (!/^#[0-9A-F]{6}$/.test(value)) throw new Error(`Invalid palette reference: ${name}`);
  return value;
}
const p = palette;
const bg = role('surface.editor'), panel = role('surface.panel'), chrome = role('surface.chrome');
const popup = role('surface.popup'), hover = role('surface.hover'), selection = role('surface.selection');
const fg = role('text.primary'), muted = role('text.secondary'), comment = role('text.comment');
const punct = role('text.punctuation'), disabled = role('text.disabled'), border = role('border.default');
const accent = role('accent.primary'), kw = role('syntax.keyword'), fn = role('syntax.function');
const type = role('syntax.type'), string = role('syntax.string'), number = role('syntax.number');
const error = role('status.error'), warning = role('status.warning'), info = role('status.info');
const success = role('status.success'), cyan = role('syntax.escape');
const alpha = (color, opacity) => color + Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
const transparent = '#00000000';
export function createTheme() {
  const colors = {};
  function set(value, ...keys) { for (const key of keys) { if (key in colors) throw new Error(`Duplicate color: ${key}`); colors[key] = value; } }
  set(fg, 'foreground', 'editor.foreground', 'sideBar.foreground', 'activityBar.foreground', 'titleBar.activeForeground', 'tab.activeForeground', 'tab.unfocusedActiveForeground', 'statusBar.foreground', 'statusBar.noFolderForeground', 'statusBar.debuggingForeground', 'panelTitle.activeForeground', 'editorWidget.foreground', 'editorHoverWidget.foreground', 'editorSuggestWidget.foreground', 'quickInput.foreground', 'input.foreground', 'dropdown.foreground', 'notificationCenterHeader.foreground', 'notifications.foreground', 'menu.foreground', 'list.activeSelectionForeground', 'list.inactiveSelectionForeground', 'list.hoverForeground', 'list.focusForeground', 'settings.headerForeground', 'terminal.foreground', 'breadcrumb.activeSelectionForeground', 'breadcrumb.focusForeground', 'debugConsole.sourceForeground');
  // No accent-colored full status bar; dark surfaces keep the code dominant.
  set(bg, 'editorGutter.background', 'editor.background', 'tab.activeBackground', 'tab.unfocusedActiveBackground', 'terminal.background', 'settings.focusedRowBackground');
  set(panel, 'sideBar.background', 'panel.background', 'statusBar.background', 'statusBar.noFolderBackground', 'statusBar.debuggingBackground', 'input.background', 'dropdown.background', 'notificationCenterHeader.background', 'settings.textInputBackground', 'settings.numberInputBackground', 'settings.dropdownBackground', 'peekViewResult.background', 'editorGroupHeader.noTabsBackground');
  set(chrome, 'activityBar.background', 'titleBar.activeBackground', 'titleBar.inactiveBackground', 'editorGroupHeader.tabsBackground', 'tab.inactiveBackground', 'tab.unfocusedInactiveBackground', 'editorPane.background', 'editorOverviewRuler.background', 'peekViewEditor.background', 'peekViewTitle.background');
  set(popup, 'editorWidget.background', 'editorHoverWidget.background', 'editorSuggestWidget.background', 'quickInput.background', 'notifications.background', 'menu.background', 'welcomePage.tileBackground', 'toolbar.activeBackground');
  set(hover, 'welcomePage.tileHoverBackground', 'list.hoverBackground', 'toolbar.hoverBackground', 'button.secondaryBackground', 'editorHoverWidget.statusBarBackground', 'tab.hoverBackground', 'tab.unfocusedHoverBackground', 'statusBarItem.hoverBackground', 'statusBarItem.activeBackground', 'statusBarItem.compactHoverBackground', 'settings.focusedRowBorder', 'breadcrumbPicker.background');
  set(selection, 'editor.selectionBackground', 'list.activeSelectionBackground', 'list.inactiveSelectionBackground', 'list.focusBackground', 'quickInputList.focusBackground', 'editorSuggestWidget.selectedBackground', 'menu.selectionBackground', 'peekViewResult.selectionBackground', 'settings.dropdownListBorder');
  set(border, 'sideBar.border', 'sideBarSectionHeader.border', 'panel.border', 'panelSection.border', 'panelSectionHeader.border', 'editorGroup.border', 'editorGroupHeader.tabsBorder', 'tab.border', 'statusBar.border', 'statusBar.noFolderBorder', 'titleBar.border', 'activityBar.border', 'input.border', 'dropdown.border', 'widget.border', 'editorWidget.border', 'editorHoverWidget.border', 'editorSuggestWidget.border', 'notifications.border', 'notificationToast.border', 'menu.border', 'menu.separatorBackground', 'pickerGroup.border', 'terminal.border', 'editorOverviewRuler.border', 'editorIndentGuide.background1', 'editorRuler.foreground', 'settings.textInputBorder', 'settings.numberInputBorder', 'settings.dropdownBorder', 'settings.sashBorder', 'debugToolBar.border', 'notebook.cellBorderColor');
  set(muted, 'descriptionForeground', 'icon.foreground', 'activityBar.inactiveForeground', 'titleBar.inactiveForeground', 'tab.inactiveForeground', 'tab.unfocusedInactiveForeground', 'panelTitle.inactiveForeground', 'sideBarTitle.foreground', 'sideBarSectionHeader.foreground', 'input.placeholderForeground', 'breadcrumb.foreground', 'notificationLink.foreground', 'editorCodeLens.foreground', 'editorInlayHint.foreground', 'editorGhostText.foreground', 'peekViewTitleDescription.foreground', 'terminalCommandDecoration.defaultBackground', 'textPreformat.foreground');
  set(disabled, 'disabledForeground', 'list.deemphasizedForeground');
  set(comment, 'editorLineNumber.foreground', 'gitDecoration.ignoredResourceForeground', 'gitDecoration.submoduleResourceForeground');
  set(fg, 'editorLineNumber.activeForeground', 'editorSuggestWidget.selectedForeground', 'menu.selectionForeground', 'button.secondaryForeground', 'peekViewTitleLabel.foreground', 'peekViewResult.lineForeground', 'peekViewResult.fileForeground', 'checkbox.foreground');
  set(accent, 'focusBorder', 'activityBar.activeBorder', 'tab.activeBorderTop', 'panelTitle.activeBorder', 'editorCursor.foreground', 'terminalCursor.foreground', 'button.background', 'badge.background', 'activityBarBadge.background', 'progressBar.background', 'inputOption.activeBorder', 'settings.modifiedItemIndicator', 'statusBarItem.remoteBackground');
  set(role('text.onAccent'), 'button.foreground', 'badge.foreground', 'activityBarBadge.foreground', 'statusBarItem.remoteForeground');
  set(error, 'button.hoverBackground');
  set(p.background.line, 'editor.lineHighlightBackground', 'editorInlayHint.background', 'editorInlayHint.typeBackground', 'editorInlayHint.parameterBackground', 'sideBarSectionHeader.background', 'debugToolBar.background', 'notebook.focusedCellBackground');
  set(transparent, 'editor.lineHighlightBorder', 'tab.activeBorder', 'tab.unfocusedActiveBorder', 'tab.unfocusedActiveBorderTop', 'editorUnnecessaryCode.border', 'editorBracketMatch.background');
  set(p.border.strong, 'editorIndentGuide.activeBackground1', 'checkbox.border', 'sash.hoverBorder');
  set(popup, 'checkbox.background');
  set(kw, 'textLink.foreground', 'textLink.activeForeground', 'list.highlightForeground', 'list.focusHighlightForeground', 'editorSuggestWidget.highlightForeground', 'editorSuggestWidget.focusHighlightForeground', 'pickerGroup.foreground', 'editorBracketMatch.border', 'debugIcon.startForeground', 'debugIcon.continueForeground');
  set(alpha(kw, .12), 'editor.inactiveSelectionBackground', 'editor.selectionHighlightBackground', 'editor.wordHighlightBackground', 'editor.hoverHighlightBackground', 'editor.rangeHighlightBackground', 'editorBracketPairGuide.activeBackground1', 'inputOption.activeBackground');
  set(alpha(kw, .12), 'editor.wordHighlightStrongBackground', 'editor.findRangeHighlightBackground', 'editor.linkedEditingBackground');
  set(alpha(number, .10), 'editor.findMatchBackground', 'editor.findMatchHighlightBackground', 'peekViewEditor.matchHighlightBackground', 'peekViewResult.matchHighlightBackground');
  set(number, 'editor.findMatchBorder');
  set(alpha(number, .55), 'editor.findMatchHighlightBorder', 'minimap.findMatchHighlight', 'editorOverviewRuler.findMatchForeground');
  set(alpha(kw, .60), 'editorOverviewRuler.selectionHighlightForeground', 'editorOverviewRuler.wordHighlightForeground', 'editorOverviewRuler.wordHighlightStrongForeground', 'editorOverviewRuler.rangeHighlightForeground', 'minimap.selectionHighlight');
  set(alpha(muted, .20), 'scrollbarSlider.background', 'editorWhitespace.foreground');
  set(alpha(muted, .32), 'scrollbarSlider.hoverBackground');
  set(alpha(muted, .44), 'scrollbarSlider.activeBackground');
  set('#00000055', 'widget.shadow', 'scrollbar.shadow');
  set(fg, 'inputOption.activeForeground', 'inputValidation.errorForeground', 'inputValidation.warningForeground', 'inputValidation.infoForeground');
  set(alpha(error, .11), 'inputValidation.errorBackground');
  set(alpha(error, .09), 'diffEditor.removedTextBackground');
  set(alpha(warning, .11), 'inputValidation.warningBackground');
  set(alpha(info, .11), 'inputValidation.infoBackground');
  set(error, 'errorForeground', 'editorError.foreground', 'list.errorForeground', 'inputValidation.errorBorder', 'notificationsErrorIcon.foreground', 'problemsErrorIcon.foreground', 'editorGutter.deletedBackground', 'gitDecoration.deletedResourceForeground', 'gitDecoration.conflictingResourceForeground', 'debugConsole.errorForeground', 'terminalCommandDecoration.errorBackground', 'editorBracketHighlight.unexpectedBracket.foreground', 'debugIcon.stopForeground', 'debugIcon.disconnectForeground', 'debugIcon.breakpointForeground');
  set(warning, 'editorWarning.foreground', 'list.warningForeground', 'inputValidation.warningBorder', 'notificationsWarningIcon.foreground', 'problemsWarningIcon.foreground', 'debugConsole.warningForeground', 'debugIcon.pauseForeground', 'editorLightBulb.foreground');
  set(info, 'editorInfo.foreground', 'inputValidation.infoBorder', 'notificationsInfoIcon.foreground', 'problemsInfoIcon.foreground', 'editorGutter.modifiedBackground', 'gitDecoration.modifiedResourceForeground', 'gitDecoration.renamedResourceForeground', 'debugConsole.infoForeground', 'editorLightBulbAutoFix.foreground');
  set(muted, 'editorHint.foreground');
  set(success, 'editorGutter.addedBackground', 'gitDecoration.addedResourceForeground', 'gitDecoration.untrackedResourceForeground', 'terminalCommandDecoration.successBackground');
  set(alpha(error, .75), 'editorOverviewRuler.errorForeground', 'minimap.errorHighlight');
  set(alpha(warning, .75), 'editorOverviewRuler.warningForeground', 'minimap.warningHighlight');
  set(alpha(info, .75), 'editorOverviewRuler.infoForeground', 'editorOverviewRuler.modifiedForeground', 'minimapGutter.modifiedBackground');
  set(alpha(success, .75), 'editorOverviewRuler.addedForeground', 'minimapGutter.addedBackground');
  set(alpha(error, .75), 'editorOverviewRuler.deletedForeground', 'minimapGutter.deletedBackground');
  set(alpha(success, .035), 'diffEditor.insertedLineBackground', 'diffEditorGutter.insertedLineBackground');
  set(alpha(error, .035), 'diffEditor.removedLineBackground', 'diffEditorGutter.removedLineBackground');
  set(alpha(success, .07), 'diffEditor.insertedTextBackground');
  set(alpha(info, .15), 'merge.currentHeaderBackground');
  set(alpha(info, .06), 'merge.currentContentBackground');
  set(alpha(success, .15), 'merge.incomingHeaderBackground');
  set(alpha(success, .06), 'merge.incomingContentBackground');
  set(alpha(type, .15), 'merge.commonHeaderBackground');
  set(alpha(type, .06), 'merge.commonContentBackground');
  set(border, 'merge.border', 'peekView.border');
  set(alpha(kw, .24), 'terminal.selectionBackground');
  set(bg, 'editorCursor.background', 'terminalCursor.background');
  set(selection, 'textBlockQuote.background', 'textCodeBlock.background', 'textPreformat.background');
  set(kw, 'textBlockQuote.border');
  set(border, 'textSeparator.foreground');
  set(fn, 'charts.blue', 'symbolIcon.functionForeground', 'symbolIcon.methodForeground', 'symbolIcon.constructorForeground');
  set(type, 'charts.purple', 'symbolIcon.classForeground', 'symbolIcon.interfaceForeground', 'symbolIcon.structForeground', 'symbolIcon.typeParameterForeground', 'symbolIcon.enumeratorForeground');
  set(string, 'charts.green', 'symbolIcon.stringForeground');
  set(number, 'charts.yellow', 'symbolIcon.numberForeground', 'symbolIcon.booleanForeground', 'symbolIcon.constantForeground', 'symbolIcon.enumeratorMemberForeground');
  set(error, 'charts.red');
  set(number, 'charts.orange');
  set(fg, 'symbolIcon.variableForeground', 'symbolIcon.propertyForeground', 'symbolIcon.fieldForeground');
  [kw, fn, type, number, cyan, string].forEach((color, i) => set(color, `editorBracketHighlight.foreground${i + 1}`));
  for (const [key, value] of Object.entries(p.terminal)) set(value, `terminal.ansi${key[0].toUpperCase()}${key.slice(1)}`);

  const tokenColors = [];
  function syntax(name, scope, foreground, fontStyle = '') { tokenColors.push({ name, scope, settings: { foreground, fontStyle } }); }
  syntax('Default text and identifiers', ['variable', 'meta.definition.variable', 'support.variable', 'variable.other.property', 'variable.other.object.property'], fg);
  syntax('Comments', ['comment', 'punctuation.definition.comment'], comment);
  syntax('Punctuation and operators', ['punctuation', 'keyword.operator', 'meta.brace', 'meta.delimiter'], punct);
  syntax('Keywords and storage', ['keyword', 'storage.type', 'storage.modifier', 'keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.word', 'keyword.operator.logical.python', 'keyword.operator.membership.python'], kw);
  syntax('Functions and callable names', ['entity.name.function', 'support.function', 'entity.name.function.decorator', 'support.function.builtin.python'], fn);
  syntax('Types and namespaces', ['entity.name.type', 'entity.name.class', 'entity.name.namespace', 'entity.name.scope-resolution', 'support.type', 'support.class', 'storage.type.primitive', 'storage.type.built-in', 'support.type.primitive', 'entity.other.inherited-class'], type);
  syntax('Strings', ['string', 'punctuation.definition.string'], string);
  syntax('Numbers, constants, booleans', ['constant.numeric', 'constant.language', 'constant.character', 'variable.other.enummember', 'support.constant'], number);
  syntax('Escapes and interpolation delimiters', ['constant.character.escape', 'punctuation.section.interpolation', 'punctuation.definition.template-expression', 'punctuation.definition.interpolation'], cyan);
  syntax('Template expression body', ['meta.template.expression'], fg);
  syntax('Embedded code', ['source.js.embedded', 'source.ts.embedded', 'source.css.embedded'], fg);
  syntax('Regular expressions', ['string.regexp'], string);
  syntax('Regular expression operators', ['keyword.operator.quantifier.regexp', 'keyword.operator.or.regexp', 'punctuation.definition.group.regexp'], kw);
  syntax('HTML and JSX tags', ['entity.name.tag', 'support.class.component', 'entity.name.tag.tsx', 'entity.name.tag.jsx'], kw);
  syntax('HTML and JSX attributes', ['entity.other.attribute-name', 'entity.other.attribute-name.jsx', 'entity.other.attribute-name.tsx'], type);
  syntax('CSS selectors', ['entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css', 'entity.other.attribute-name.pseudo-class.css', 'entity.other.attribute-name.pseudo-element.css'], type);
  syntax('CSS property names', ['support.type.property-name.css', 'support.type.property-name.scss', 'support.type.property-name.less'], fg);
  syntax('CSS values and units', ['support.constant.property-value.css', 'support.constant.color.w3c-standard-color-name.css', 'keyword.other.unit'], number);
  syntax('JSON property names', ['support.type.property-name.json', 'string.json support.type.property-name.json'], type);
  syntax('JSON property punctuation', ['punctuation.support.type.property-name.json'], punct);
  syntax('Markdown headings', ['markup.heading', 'entity.name.section.markdown'], kw);
  syntax('Markdown inline code', ['markup.inline.raw', 'markup.fenced_code.block.markdown'], string);
  syntax('Markdown links', ['markup.underline.link', 'string.other.link'], fn);
  syntax('Markdown quotes and lists', ['markup.quote', 'punctuation.definition.list.begin.markdown'], muted);
  syntax('Markdown emphasis', ['markup.italic'], fg, 'italic');
  syntax('Markdown strong emphasis', ['markup.bold'], fg, 'bold');
  syntax('Diff additions', ['markup.inserted'], success);
  syntax('Diff removals', ['markup.deleted'], error);
  syntax('Diff changes', ['markup.changed'], warning);
  syntax('Invalid tokens', ['invalid', 'invalid.illegal'], error);

  const plain = foreground => ({ foreground, bold: false, italic: false, underline: false });
  const semanticTokenColors = {
    namespace: plain(type), type: plain(type), class: plain(type), enum: plain(type), interface: plain(type), struct: plain(type), typeParameter: plain(type),
    parameter: plain(fg), variable: plain(fg), property: plain(fg), enumMember: plain(number), event: plain(fn), function: plain(fn), method: plain(fn), macro: plain(fn), decorator: plain(fn),
    label: plain(fg), comment: plain(comment), string: plain(string), number: plain(number), regexp: plain(string), operator: plain(punct), keyword: plain(kw),
    'variable.readonly': plain(fg), 'property.readonly': plain(fg), 'variable.defaultLibrary': plain(fg),
    'type.defaultLibrary': plain(type), 'function.defaultLibrary': plain(fn), 'method.defaultLibrary': plain(fn),
    '*.deprecated': { strikethrough: true }
  };
  // Color and style only; the extension contributes no executable code or settings.
  return { $schema: 'vscode://schemas/color-theme', name: 'Velune Dark', type: 'dark', semanticHighlighting: true, colors, tokenColors, semanticTokenColors };
}
export async function build() {
  const theme = createTheme();
  await mkdir(path.join(root, 'themes'), { recursive: true });
  await mkdir(path.join(root, 'dist'), { recursive: true });
  await writeFile(path.join(root, 'themes/velune-dark-color-theme.json'), JSON.stringify(theme, null, 2) + '\n');
  await writeFile(path.join(root, 'core/resolved-tokens.json'), JSON.stringify(Object.fromEntries(Object.keys(roles).map(key => [key, role(key)])), null, 2) + '\n');
  console.log(`Built Velune Dark: ${Object.keys(theme.colors).length} UI colors, ${theme.tokenColors.length} TextMate rules, ${Object.keys(theme.semanticTokenColors).length} semantic selectors.`);
  return theme;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
