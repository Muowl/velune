# Avaliação no VS Code e Cursor

Instale o VSIX e selecione Velune Dark. Use primeiro a fonte e o tamanho com que você costuma programar. Abra os arquivos de `tests/fixtures` ou um projeto real.

## O que observar

1. **Leitura contínua:** trabalhe em um arquivo habitual e observe se comentários, pontuação ou cores específicas chamam atenção demais ou ficam difíceis de ler.
2. **Sintaxe:** confira TypeScript e TSX, C# e C++, depois HTML/CSS, JSON e Python. Use também o [roteiro de compatibilidade](COMPATIBILIDADE.md). Funções devem usar azul, tipos rosa, palavras-chave lavanda, strings verde e números âmbar. Variáveis comuns ficam neutras.
3. **Tokens semânticos:** compare temporariamente `editor.semanticHighlighting.enabled` ligado e desligado, de preferência nas configurações do workspace. Reponha o valor anterior ao terminar. A classificação pode ficar mais precisa quando o servidor de linguagem está ativo, mas as mesmas categorias devem manter suas cores.
4. **Seleção e busca:** selecione comentários e código colorido; pesquise um termo repetido; compare a ocorrência atual com as demais. Verifique também combinações de seleção e busca.
5. **Git:** examine um diff real, com linhas adicionadas e removidas. Os fundos são discretos para manter a leitura; os marcadores laterais reforçam o significado.
6. **Interface:** abra a paleta de comandos, sugestões de código, tooltips, menus e notificações. Confira foco de teclado, item selecionado, textos secundários e botões.
7. **Diagnósticos:** em um arquivo de teste, introduza temporariamente um erro de sintaxe e um nome inexistente. Confira sublinhados, ícones e o painel Problemas. Desfaça as alterações depois.
8. **Terminal:** execute `python tests/fixtures/terminal-colors.py` no terminal integrado. O preto ANSI é intencionalmente escuro. Verifique principalmente vermelho, verde, azul e cinza claro.

## Feedback útil

Registre a linguagem, a fonte e seu tamanho, a extensão de linguagem utilizada e o elemento que incomodou. Uma captura com o trecho em contexto ajuda a distinguir problemas da paleta, da gramática ou de personalizações existentes.

## O que já foi verificado automaticamente

O resultado detalhado está em `validation.json`, gerado por `npm test`. Ele inclui pares de contraste, integridade da geração e gramáticas testadas. A referência de identificadores da interface foi consultada em 23/10/2026 e está registrada em `tests/vscode-color-ids.json`.

## O que falta antes de publicar

Avaliação dentro do VS Code e do Cursor, ajustes a partir do uso, confirmação do identificador de publicação, escolha da licença de reutilização e preparação das imagens de apresentação. O código está em https://github.com/Muowl/velune; o protótipo não foi publicado em nenhum marketplace.
