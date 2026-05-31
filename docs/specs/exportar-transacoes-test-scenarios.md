# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação Bem-Sucedida

Dado que existem transações cadastradas

Quando o usuário clicar em "Exportar CSV"

Então um arquivo CSV deve ser gerado

E o download deve iniciar automaticamente

E o nome do arquivo deve seguir o padrão:

transacoes-piggbank-YYYYMMDD.csv

---

## Cenário 2: Sem Transações

Dado que não existem transações

Quando o usuário clicar em "Exportar CSV"

Então deve ser gerado um CSV contendo apenas os cabeçalhos

---

## Cenário 3: Caracteres Especiais

Dado que existem categorias com acentos

Quando o CSV for gerado

Então os caracteres devem ser exportados corretamente em UTF-8

---

## Cenário 4: Estrutura do CSV

O CSV deve possuir as colunas:

- Data
- Tipo
- Valor
- Categoria

Separadas por vírgula.