# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação Bem-Sucedida
- Dado: Existem transações exibidas no dashboard.
- Quando: Usuário clica no botão "Exportar CSV".
- Então: Um arquivo CSV é gerado e o download é iniciado automaticamente com o nome "transacoes-piggbank-YYYYMMDD.csv".

## Cenário 2: Formato Correto do CSV
- Dado: Existem transações no dashboard.
- Quando: O CSV é gerado.
- Então: O arquivo contém as colunas Data (YYYY-MM-DD), Tipo (Entrada/Saída), Valor (número), Categoria (string), separadas por vírgula, codificação UTF-8.

## Cenário 3: Sem Transações
- Dado: Não há transações exibidas no dashboard.
- Quando: Usuário clica em "Exportar CSV".
- Então: Um CSV com apenas os cabeçalhos é gerado e o download é iniciado.

## Cenário 4: Transações com Caracteres Especiais
- Dado: Existe uma transação cuja categoria ou descrição contém vírgulas ou acentos (ex: "Assinatura, mensal", "Serviços").
- Quando: O CSV é gerado.
- Então: Os campos com vírgulas são envolvidos em aspas duplas e os acentos são preservados corretamente em UTF-8.

## Cenário 5: Nome do Arquivo com Data Correta
- Dado: O usuário exporta o CSV no dia 29/05/2026.
- Quando: O download é iniciado.
- Então: O arquivo se chama "transacoes-piggbank-20260529.csv".

## Cenário 6: Não Afeta o Estado do App
- Dado: O usuário exporta o CSV.
- Quando: O download é concluído.
- Então: As métricas e a tabela de transações permanecem inalteradas.