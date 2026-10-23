# C#, C++ e Cursor

O Velune 0.1.2 utiliza o formato de tema do VS Code, com regras TextMate e coloração semântica. A paleta central continua independente do editor. Não é necessário manter uma variante diferente só para o Cursor.

## Resultado da validação

| Camada | Cobertura | Resultado |
| --- | --- | --- |
| C# / TextMate | Records, generics, delegate, atributos, async/await, métodos de extensão, propriedades, strings interpoladas, verbatim e raw, comentários XML e pré-processador | 28 verificações específicas de cor com a gramática do Shiki |
| C++ / TextMate | Classes, structs, enum, templates, requires, atributos, referências, lambdas, macros, casts, strings raw e escapes | 28 verificações específicas de cor com a gramática do Shiki |
| Semântica C# | Tipos próprios declarados pela extensão C#, incluindo delegate, records, escapes e documentação XML | Contratos estáticos conferidos com as declarações do fornecedor |
| Semântica C++ | Herança de tipos de C/C++ e classificações de clangd, incluindo concept, macro e typeParameter | Contratos estáticos conferidos com as declarações dos fornecedores |
| Contraste | Texto, sintaxe, interface e terminal nos fundos descritos no relatório | 102 pares aprovados; preto ANSI excluído |
| VS Code / Cursor em execução | Instalação, extensões de linguagem e interface de IA | Avaliação manual pendente |

O total e os resultados reproduzíveis estão em [validation.json](validation.json). A prévia em [token-preview.html](token-preview.html) usa TextMate; não é captura do Cursor e não contém a camada semântica. O exemplo C++ também passou por `g++ -std=c++20 -Wall -Wextra -pedantic -fsyntax-only tests/fixtures/theme.cpp`. O exemplo C# requer C# 12 para compilação e não foi compilado nesta avaliação.

## Ajustes desta versão

- **C#:** delegates permanecem rosa como tipos; escapes mantêm o ciano quando o fornecedor envia `stringEscapeCharacter`; documentação XML fica na cor dos comentários nas duas camadas.
- **C++:** referências e ponteiros declarados usam a cor da pontuação, tipos de retorno de lambdas usam rosa, atributos recebem destaque e casts nomeados usam lavanda.
- **clangd:** conceitos usam rosa; modificadores usam lavanda; nomes de construtores e destrutores usam azul. As regras específicas têm sufixo `:cpp` ou `:csharp`, preservando outras linguagens.

A gramática não resolve todos os símbolos: referências a enum, macros ou conceitos podem mudar de categoria quando o servidor de linguagem analisa o projeto. Por exemplo, `Named` na declaração do conceito pode ficar neutro sem semântica e rosa com clangd. Isso depende da classificação fornecida ao tema. O tema não tenta deduzir tipos pela grafia dos identificadores.

## Instalar e avaliar no Cursor

1. Baixe o VSIX do projeto, extraia o ZIP do artefato e abra o Cursor em modo **IDE**. Se estiver na janela de agentes, execute **Open IDE** pela paleta.
2. Execute **Extensions: Install from VSIX…**, selecione `velune-0.1.2.vsix` e depois escolha **Velune Dark** em **Preferences: Color Theme**.
3. Use uma extensão de linguagem disponível e compatível com a sua instalação do Cursor. O tema não instala compiladores, IntelliSense ou servidores de linguagem. Os fornecedores usados nos contratos de teste não representam uma garantia de disponibilidade no catálogo do Cursor.
4. Abra `theme.cs` e `theme.cpp` de `tests/fixtures` e depois um projeto real. Aguarde a análise da extensão de linguagem. Para C++, use a configuração de compilação do seu projeto.
5. Compare temporariamente `editor.semanticHighlighting.enabled` em `false` e `true` nas configurações do workspace. O valor `configuredByTheme` também permite a semântica habilitada pelo Velune. Restaure sua preferência ao concluir.
6. Use **Developer: Inspect Editor Tokens and Scopes** sobre um símbolo que pareça incorreto. Registre o tipo semântico, os modificadores e os escopos TextMate. Isso distingue um problema do tema de uma classificação ausente no fornecedor.
7. Confira sugestões, hover, inlay hints, diagnósticos, terminal, seleção, busca e diffs. No Cursor, confira também texto sugerido pela IA, revisão de alterações e blocos de código do chat. Superfícies próprias do Cursor podem aplicar estilos que não são controlados pelos identificadores comuns do VS Code.

Critério visual: tipos rosa, chamadas azuis, palavras-chave lavanda, strings verdes, números âmbar; variáveis e propriedades neutras. Comentários continuam legíveis e sem itálico. Tipos primitivos de C# são classificados como palavras-chave pela gramática utilizada.

Para registrar a avaliação, anote versão do editor, sistema operacional, extensão de linguagem e versão, arquivo, símbolo, coloração semântica ligada/desligada e uma captura do trecho.

## Distribuição futura

O Cursor documenta o uso do Open VSX para extensões de terceiros. Na publicação, devemos preparar tanto o VS Code Marketplace quanto o Open VSX, mantendo o mesmo código e a mesma versão. A versão atual continua disponível apenas como protótipo VSIX; nenhum catálogo foi publicado.

## Fontes técnicas

Consultadas em 23/10/2026. Os identificadores de blob e os tipos usados nos contratos estão em [semantic-providers.json](../tests/semantic-providers.json).

- [Cursor: temas](https://cursor.com/help/customization/themes)
- [Cursor: extensões](https://cursor.com/help/customization/extensions)
- [VS Code: coloração semântica](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
- [Extensão C#: tipos e escopos semânticos](https://github.com/dotnet/vscode-csharp/blob/main/package.json)
- [C/C++: tipos semânticos e herança](https://github.com/microsoft/vscode-cpptools/blob/main/Extension/package.json)
- [clangd: classificação semântica](https://github.com/llvm/llvm-project/blob/main/clang-tools-extra/clangd/SemanticHighlighting.cpp)
