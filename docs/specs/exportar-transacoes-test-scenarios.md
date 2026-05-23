# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação Bem-Sucedida
- Dado: Transações existentes no dashboard.
- Quando: Usuário clica em "Exportar CSV".
- Então: Arquivo CSV é gerado com colunas Data, Tipo, Valor, Categoria e download é iniciado.

## Cenário 2: Sem Transações
- Dado: Nenhuma transação exibida na tabela.
- Quando: Tenta exportar clicando no botão.
- Então: CSV com cabeçalhos vazios é gerado ou exibe uma mensagem de erro na tela.

## Cenário 3: Caracteres Especiais e Acentuação
- Dado: Transações com acentos na categoria (ex: "Produção").
- Quando: O arquivo é exportado.
- Então: A codificação UTF-8 deve garantir que os caracteres não fiquem corrompidos.
