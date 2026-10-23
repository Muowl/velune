<img src="assets/icon.png" width="96" height="96" alt="Velune: guarda-chuva lavanda com cabo carmesim">

# Velune

Tema dark inspirado na paleta de Evernight, de Honkai: Star Rail. Combina fundo quase preto com violeta discreto, sintaxe em lavanda, rosa e azul, e detalhes carmesim na interface.

Versão 0.1.3: versão inicial para VS Code e editores compatíveis, com roteiro de avaliação no Cursor. A identidade local da extensão é `muowl.velune`; esse identificador não confirma a existência ou a disponibilidade de um publisher no Marketplace.

Repositório: [Muowl/velune](https://github.com/Muowl/velune).

## Instalação

1. Obtenha `velune-0.1.3.vsix` compilando o projeto ou baixando o artefato de uma execução bem-sucedida em [Actions](https://github.com/Muowl/velune/actions/workflows/validate.yml). O download de artefatos exige login no GitHub; extraia o ZIP antes de instalar.
2. No VS Code ou Cursor (modo IDE), abra Extensões (`Ctrl+Shift+X`).
3. No menu `…`, escolha **Install from VSIX… / Instalar do VSIX…** e selecione o arquivo.
4. Abra a paleta de comandos (`Ctrl+Shift+P`), execute **Preferences: Color Theme / Preferências: Tema de Cores** e escolha **Velune Dark**.

Pelo terminal, com o comando `code` disponível:

```sh
code --install-extension velune-0.1.3.vsix
```

No Cursor, também é possível executar `Extensions: Install from VSIX…` pela paleta de comandos. Consulte o [guia de C#, C++ e Cursor](docs/COMPATIBILIDADE.md) para configuração e avaliação.

O tema mantém a fonte, o tamanho do texto, o conjunto de ícones e as demais configurações pessoais. Ele contribui somente cores e estilos; não possui código de ativação, telemetria ou dependências em execução.

O ícone combina um guarda-chuva inclinado de copa sólida lavanda com cabo carmesim sobre o fundo do tema. O [símbolo vetorial](assets/velune-mark.svg) tem fundo transparente; o [ícone completo](assets/velune-icon.svg) inclui o fundo `#141119`. A extensão utiliza a versão PNG de 256 × 256 pixels.

## Paleta

| Papel | Cor |
| --- | --- |
| Editor | `#141119` |
| Painéis | `#1B1723` |
| Texto | `#E6DFEC` |
| Comentários | `#96889F` |
| Palavras-chave | `#C99AF7` |
| Funções | `#AFBEF1` |
| Tipos | `#E2B1D6` |
| Strings | `#B5CBAA` |
| Números e literais | `#E2C291` |
| Destaque carmesim | `#E14C6F` |

Variáveis comuns, parâmetros e propriedades permanecem neutros, inclusive variáveis `const`. Comentários e código não recebem itálico ou negrito automáticos. Markdown preserva o estilo de ênfase indicado no texto.

Erros usam um vermelho mais claro que o destaque da marca. Avisos, informações e mudanças do Git têm cores próprias. A barra de status permanece escura. O tema também define as 16 cores ANSI do terminal.

## Cobertura e limites

Os testes usam gramáticas TextMate reais de TypeScript, JavaScript, TSX, HTML, CSS, JSON, Python, Markdown, C#, C++, Rust e Java. Há 142 verificações específicas de símbolos nessas quatro últimas linguagens, além dos testes gerais. As regras semânticas cobrem tokens padrão e classificações próprias dos fornecedores. Os contratos estáticos usam declarações dos projetos C#, C/C++, clangd, rust-analyzer e Java da Red Hat; não executam esses servidores de linguagem.

A extensão foi empacotada e validada automaticamente, mas ainda precisa de uma sessão de uso no VS Code e no Cursor. A compatibilidade com o Cursor se baseia no formato de extensão de tema e nas interfaces comuns do editor; a interface própria de IA ainda requer avaliação no aplicativo. Os testes de gramática usam Shiki com versão fixa; extensões instaladas podem oferecer gramáticas ou tokens semânticos diferentes. A aparência também depende da fonte, do monitor e de personalizações do usuário.

As verificações de contraste cobrem texto e sintaxe no editor, seleção, linha atual, busca, referências e fundos de diferenças do Git, além de pares da interface e do terminal. Decorações sobrepostas e estados adicionais exigem revisão visual. O preto ANSI é uma cor de base deliberadamente escura e não satisfaz o limiar adotado para texto normal. Esses testes não constituem uma certificação de acessibilidade.

O [guia de publicação](docs/PUBLICACAO.md) registra o pacote, os comandos de envio e as pendências de licença e avaliação manual.

## Desenvolvimento

Requisitos: Node.js 22 ou superior e npm. O ambiente de criação usou Node.js 24.19.0. As dependências de desenvolvimento estão fixadas em `package-lock.json`.

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run package
```

`npm run build:icon` regenera o ícone a partir de `assets/velune-mark.svg`. O build completo também gera as exportações PNG de 1024 pixels em `dist/velune-icon-1024.png` e `dist/velune-mark-1024.png`, esta última com transparência. A ferramenta de renderização fica restrita ao desenvolvimento.

O VSIX será criado em `dist/velune-0.1.3.vsix`. Os testes também geram `dist/token-preview.html` e sua cópia versionada `docs/token-preview.html`, uma prévia da sintaxe com as gramáticas reais, e `docs/validation.json`, com os resultados numéricos.

O workflow **Validate Velune** executa o empacotamento e os testes em pushes para `main` e em pull requests. Ele verifica se os arquivos gerados estão atualizados e disponibiliza o VSIX, a prévia e o relatório como artefatos por 30 dias. Não há publicação automática em marketplaces.

Para visualizar durante o desenvolvimento, abra esta pasta no VS Code, instale as dependências e pressione `F5`. A configuração **Preview Velune** abre uma janela de desenvolvimento com os exemplos de código. Nessa janela, selecione **Velune Dark**.

## Estrutura

- `assets/velune-mark.svg`: desenho vetorial original; `icon.png` e `velune-icon.svg` são gerados.
- `core/palette.json`: valores das cores.
- `core/roles.json`: significados independentes de plataforma.
- `core/resolved-tokens.json`: papéis resolvidos, gerados pelo build.
- `scripts/build.mjs`: adaptação para as configurações do VS Code.
- `themes/velune-dark-color-theme.json`: resultado gerado; não editar manualmente.
- `tests/fixtures/`: código para avaliação.
- `scripts/validate.mjs`: contraste, consistência, gramáticas e integridade do tema.

Novas plataformas deverão consumir os papéis centrais por adaptadores próprios. O adaptador implementado gera o formato de tema do VS Code, reutilizado pelo Cursor. Outros formatos de tema precisarão de adaptadores próprios.

## Referências

- https://cursor.com/help/customization/themes
- https://cursor.com/help/customization/extensions

- https://code.visualstudio.com/api/extension-guides/color-theme
- https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide
- https://code.visualstudio.com/api/references/theme-color
- https://code.visualstudio.com/api/working-with-extensions/publishing-extension

Projeto independente inspirado nas referências visuais fornecidas. As artes da personagem não são distribuídas no pacote. O código está disponível para avaliação, com direitos reservados; uma licença de reutilização ainda será escolhida. Esta versão está marcada como `UNLICENSED`.
