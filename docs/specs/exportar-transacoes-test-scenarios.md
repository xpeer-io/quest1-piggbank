# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Renderização do Componente
- **Dado:** O Dashboard está carregado.
- **Quando:** O componente é montado.
- **Então:** Um botão com o texto "Exportar CSV" deve estar visível próximo à tabela.

## Cenário 2: Exportação com Dados (Caminho Feliz)
- **Dado:** Existem 3 transações na lista (Ex: Aluguel, Salário, Mercado).
- **Quando:** O usuário clica em "Exportar CSV".
- **Então:** A função de download deve ser chamada.
- **E:** O conteúdo do CSV deve conter os cabeçalhos: "Data,Tipo,Valor,Categoria".
- **E:** O nome do arquivo deve seguir o padrão `transacoes-piggbank-YYYYMMDD.csv`.

## Cenário 3: Respeito aos Filtros
- **Dado:** Existem 10 transações, mas o usuário filtrou apenas por "Entradas".
- **Quando:** O usuário clica em "Exportar CSV".
- **Então:** O arquivo gerado deve conter apenas as transações do tipo "Entrada".

## Cenário 4: Lista Vazia
- **Dado:** Não há transações exibidas (lista vazia).
- **Quando:** O usuário clica em "Exportar CSV".
- **Então:** O sistema deve baixar um arquivo apenas com os cabeçalhos ou exibir um alerta "Nenhuma transação para exportar".

## Cenário 5: Caracteres Especiais (Edge Case)
- **Dado:** Uma transação com categoria "Educação & Lazer" e valor com vírgula.
- **Quando:** Exportado para CSV.
- **Então:** O arquivo deve estar codificado em UTF-8 para manter o "ç" e o "&" corretamente.