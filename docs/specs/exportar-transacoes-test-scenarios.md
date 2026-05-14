# Cenários de Teste: Exportação de Transações em CSV

## Objetivo

Permitir que o usuário exporte as transações exibidas no dashboard para um arquivo CSV.

---

## Cenário 1: Exportação bem-sucedida

### Dado
Que existem transações exibidas no dashboard.

### Quando
O usuário clicar no botão "Exportar CSV".

### Então
Um arquivo CSV deve ser gerado automaticamente contendo:
- Data
- Tipo
- Valor
- Categoria

E o download deve iniciar automaticamente.

---

## Cenário 2: Nome correto do arquivo

### Dado
Que a exportação foi realizada.

### Então
O nome do arquivo deve seguir o padrão:

transacoes-piggbank-YYYYMMDD.csv

---

## Cenário 3: Estrutura do CSV

### Dado
Uma exportação válida.

### Então
O CSV deve possuir os cabeçalhos:

Data,Tipo,Valor,Categoria

---

## Cenário 4: Exportação sem transações

### Dado
Que não existem transações disponíveis.

### Quando
O usuário tentar exportar o CSV.

### Então
O sistema deve:
- gerar um CSV vazio contendo apenas cabeçalhos
OU
- informar que não existem transações.

---

## Cenário 5: Caracteres especiais

### Dado
Transações contendo caracteres especiais.

### Quando
O CSV for exportado.

### Então
Os caracteres devem ser preservados corretamente em UTF-8.

Exemplos:
- João
- Café
- Alimentação

---

## Cenário 6: Transações filtradas

### Dado
Que filtros estejam aplicados no dashboard.

### Quando
O usuário exportar o CSV.

### Então
Apenas as transações filtradas devem ser exportadas.

---

## Cenário 7: Integridade da aplicação

### Quando
A exportação for realizada.

### Então
Nenhum dado ou estado da aplicação deve ser alterado.