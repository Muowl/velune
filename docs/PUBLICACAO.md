# Publicação do Velune 0.1.3

O pacote é `dist/velune-0.1.3.vsix`, com identificador `muowl.velune` e ícone PNG de 256 pixels. Esta alteração prepara os arquivos; não publica a extensão nos catálogos.

## Gerar o pacote

```sh
npm ci --ignore-scripts
npm run package
```

O mesmo VSIX pode ser enviado ao VS Code Marketplace e ao Open VSX. O workflow Validate Velune também disponibiliza o pacote e o relatório como artefatos. Use a execução correspondente ao commit que pretende publicar.

## Situação antes do envio

- O tema usa apenas cores e estilos, com 12 gramáticas verificadas e contratos semânticos estáticos de cinco fornecedores. Os resultados exatos estão em [validation.json](validation.json).
- O VSIX inclui o tema, o ícone, o manifesto, o README, o changelog e a licença. Compiladores, exemplos, scripts e dependências de desenvolvimento não fazem parte do pacote.
- `publisher` está definido como `muowl`, igual ao identificador usado no projeto VesperVeil. O envio exige acesso ao publisher/namespace em cada catálogo.
- A licença MIT foi adotada. O texto completo está em `LICENSE`, e o manifesto e o lockfile usam o identificador `MIT`.
- Ainda falta uma sessão de avaliação dentro do VS Code ou Cursor com os servidores de linguagem ativos. As prévias Shiki e os contratos estáticos não substituem esse teste. Use o [roteiro](TESTE-NO-VSCODE.md), especialmente comentários, seleção, busca, diffs e a interface de IA do Cursor.

## Enviar o VSIX

No VS Code Marketplace, use o painel de gerenciamento do publisher ou a ferramenta já instalada no projeto:

```sh
npx --no-install vsce publish --packagePath dist/velune-0.1.3.vsix
```

No Open VSX, com acesso ao namespace e autenticação configurados:

```sh
npx ovsx publish dist/velune-0.1.3.vsix
```

Configure as credenciais no seu ambiente conforme a documentação dos catálogos. Depois do envio, confira versão, nome, ícone, licença e instalação nos dois catálogos; adicione os links definitivos ao README. A publicação não é automatizada por este repositório.

## Referências

- [VS Code: publicar extensões](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Open VSX: publicar extensões](https://github.com/eclipse-openvsx/openvsx/wiki/Publishing-Extensions)
