# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação com sucesso

- Dado que existem transações no dashboard
- Quando o usuário clicar em "Exportar CSV"
- Então um arquivo CSV deve ser gerado
- E o download deve iniciar automaticamente
- E o nome deve seguir:
  transacoes-piggbank-YYYYMMDD.csv
- E o arquivo deve conter todas as transações exibidas na tela
- E a página não deve ser recarregada durante a exportação

---

## Cenário 2: CSV deve conter colunas corretas

- O CSV deve conter os cabeçalhos:
  - Data
  - Tipo
  - Valor
  - Categoria
- Os dados devem ser separados por vírgula
- Cada transação deve ocupar uma linha do arquivo
- O arquivo deve utilizar codificação UTF-8

---

## Cenário 3: Sem transações

- Dado que não existem transações
- Quando o usuário exportar
- Então deve gerar apenas os cabeçalhos
- Ou exibir mensagem de erro
- E a aplicação não deve quebrar
- E o botão deve continuar funcionando normalmente

---

## Cenário 4: Caracteres especiais

- Deve exportar corretamente caracteres UTF-8
- Exemplo:
  - Alimentação
  - Transferência
  - Cartão de Crédito
- Os caracteres especiais não devem ficar corrompidos no CSV

---

## Cenário 5: Datas formatadas

- As datas devem seguir:
  YYYY-MM-DD
- Todas as linhas devem manter o mesmo padrão de data

---

## Cenário 6: Exportação com filtros aplicados

- Dado que existem filtros ativos no dashboard
- Quando o usuário exportar o CSV
- Então apenas as transações visíveis devem ser exportadas
- E transações ocultas pelos filtros não devem aparecer no arquivo

---

## Cenário 7: Integridade da aplicação

- A exportação não deve alterar métricas do dashboard
- A exportação não deve modificar transações existentes
- O estado global da aplicação deve permanecer intacto
- Nenhum dado deve ser perdido após a exportação

---

## Cenário 8: Múltiplas transações

- Dado que existem várias transações cadastradas
- Quando o CSV for exportado
- Então todas as transações devem aparecer corretamente
- E não devem existir linhas duplicadas
- E não devem existir linhas vazias indevidas