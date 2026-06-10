# Cenários de Teste: Exportação de Transações em CSV

## Funcionalidade

Exportação de transações financeiras em formato CSV no dashboard do Piggbank.

## User Story

Como proprietário de uma PME, quero poder exportar minhas transações em um arquivo CSV para análise externa, backup ou integração com outras ferramentas.

## Requisitos principais

- O dashboard deve exibir um botão "Exportar CSV" próximo à tabela de transações.
- Ao clicar no botão, o sistema deve gerar um arquivo CSV com as transações atualmente exibidas.
- O CSV deve conter as colunas: Data, Tipo, Valor e Categoria.
- A data deve estar no formato `YYYY-MM-DD`.
- O separador deve ser vírgula.
- A codificação deve ser UTF-8.
- O nome do arquivo deve seguir o formato `transacoes-piggbank-YYYYMMDD.csv`.
- Caso não existam transações, o sistema deve gerar um CSV contendo apenas os cabeçalhos ou exibir uma mensagem clara ao usuário.
- A exportação não deve alterar métricas, filtros ou estado financeiro do dashboard.

## Cenário 1: Exportação bem-sucedida com transações

**Dado** que existem transações exibidas na tabela do dashboard  
**Quando** o usuário clicar no botão "Exportar CSV"  
**Então** o sistema deve gerar um arquivo CSV contendo todas as transações exibidas  
**E** o download deve ser iniciado automaticamente  
**E** o arquivo deve possuir o nome no formato `transacoes-piggbank-YYYYMMDD.csv`.

## Cenário 2: Estrutura correta do CSV

**Dado** que existem transações exibidas  
**Quando** o CSV for gerado  
**Então** a primeira linha deve conter os cabeçalhos `Data,Tipo,Valor,Categoria`  
**E** cada linha seguinte deve representar uma transação  
**E** os campos devem estar separados por vírgula.

## Cenário 3: Formato correto da data

**Dado** que uma transação possui uma data válida  
**Quando** o CSV for gerado  
**Então** a data deve ser exportada no formato `YYYY-MM-DD`.

## Cenário 4: Exportação de valores numéricos

**Dado** que uma transação possui um valor financeiro  
**Quando** o CSV for gerado  
**Então** o valor deve ser exportado como número  
**E** não deve conter símbolos monetários como `R$`.

## Cenário 5: Exportação com caracteres especiais

**Dado** que uma transação possui categoria com acentos ou caracteres especiais  
**Quando** o CSV for gerado  
**Então** o conteúdo deve ser preservado corretamente em UTF-8.

## Cenário 6: Exportação sem transações

**Dado** que nenhuma transação está sendo exibida  
**Quando** o usuário clicar em "Exportar CSV"  
**Então** o sistema deve gerar um CSV contendo apenas os cabeçalhos  
**Ou** exibir uma mensagem clara informando que não há transações para exportar.

## Cenário 7: Nome do arquivo com data atual

**Dado** que o usuário realiza uma exportação no dia atual  
**Quando** o arquivo for gerado  
**Então** o nome do arquivo deve seguir o padrão `transacoes-piggbank-YYYYMMDD.csv`.

## Cenário 8: Exportação não altera o estado do dashboard

**Dado** que o dashboard possui métricas e transações exibidas  
**Quando** o usuário exportar as transações em CSV  
**Então** as métricas do dashboard não devem ser alteradas  
**E** nenhuma transação deve ser criada, editada ou removida.

## Critérios de aceite

- Deve existir um botão "Exportar CSV" próximo à tabela de transações.
- O CSV deve conter as colunas `Data`, `Tipo`, `Valor` e `Categoria`.
- O arquivo deve ser baixado automaticamente.
- O nome do arquivo deve seguir o padrão `transacoes-piggbank-YYYYMMDD.csv`.
- A funcionalidade deve possuir testes automatizados.
- Os testes devem passar com `npm test`.
- A aplicação deve fazer build com sucesso com `npm run build`.
- A cobertura final de testes deve ser igual ou superior a 80%, conforme solicitado na atividade.
