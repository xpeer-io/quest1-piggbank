# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação Bem-Sucedida
- Dado que existem transações no dashboard
- Quando o usuário clicar em "Exportar CSV"
- Então um arquivo CSV deve ser gerado
- E o download deve iniciar automaticamente
- E o nome deve seguir o padrão transacoes-piggbank-YYYYMMDD.csv

## Cenário 2: Estrutura do CSV
- Dado que existem transações
- Quando o CSV for gerado
- Então deve conter as colunas:
  - Data
  - Tipo
  - Valor
  - Categoria

## Cenário 3: Sem Transações
- Dado que não existem transações
- Quando o usuário clicar em "Exportar CSV"
- Então deve ser gerado um CSV apenas com cabeçalhos
  ou uma mensagem informando que não há dados

## Cenário 4: Caracteres Especiais
- Dado que existem categorias com acentos
- Quando o CSV for exportado
- Então os caracteres devem ser preservados

## Cenário 5: Filtros Aplicados
- Dado que há filtros ativos
- Quando o usuário exportar
- Então apenas as transações filtradas devem ser exportadas