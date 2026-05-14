# Cenários de Teste: Exportação de Transações em CSV

## Objetivo
Garantir que a funcionalidade de exportação de transações em CSV funcione corretamente, respeitando os requisitos do Piggbank e mantendo consistência com o Design System e arquitetura do projeto.

---

# Cenário 1: Exportação bem-sucedida com transações

## Dado
Que existem transações visíveis na tabela do dashboard.

## Quando
O usuário clicar no botão "Exportar CSV".

## Então
Um arquivo CSV deve ser gerado automaticamente contendo:

- Data no formato YYYY-MM-DD
- Tipo da transação (Entrada ou Saída)
- Valor numérico
- Categoria

E o download deve iniciar automaticamente com o nome:

transacoes-piggbank-YYYYMMDD.csv

---

# Cenário 2: Exportação considerando filtros aplicados

## Dado
Que o usuário aplicou filtros de período no dashboard.

## Quando
O usuário exportar o CSV.

## Então
O arquivo deve conter apenas as transações atualmente exibidas na tabela.

---

# Cenário 3: Exportação sem transações

## Dado
Que não existem transações disponíveis.

## Quando
O usuário clicar em "Exportar CSV".

## Então
O sistema deve:

- Gerar um CSV contendo apenas os cabeçalhos
OU
- Exibir mensagem informando que não há transações para exportar.

---

# Cenário 4: Caracteres especiais no CSV

## Dado
Que existem transações contendo caracteres especiais e acentos.

## Quando
O CSV for exportado.

## Então
Os caracteres devem ser preservados corretamente em UTF-8.

Exemplo:
- Alimentação
- Assinatura São Paulo
- Café

---

# Cenário 5: Formatação correta do CSV

## Dado
Que existem transações cadastradas.

## Quando
O arquivo CSV for gerado.

## Então
O CSV deve:

- Utilizar separador vírgula
- Conter cabeçalhos válidos
- Estar codificado em UTF-8
- Possuir uma linha por transação

---

# Cenário 6: Nome correto do arquivo

## Dado
Que o usuário exportou as transações.

## Então
O nome do arquivo deve seguir o padrão:

transacoes-piggbank-YYYYMMDD.csv

Exemplo:
transacoes-piggbank-20260513.csv

---

# Cenário 7: Integração com dashboard

## Dado
Que o dashboard está funcionando normalmente.

## Quando
O usuário exportar o CSV.

## Então
A exportação não deve:

- Alterar métricas
- Recarregar a página
- Modificar o estado atual da aplicação