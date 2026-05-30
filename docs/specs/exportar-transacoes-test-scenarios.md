# Cenários de Teste: Exportação de Transações em CSV

Este documento descreve os cenários de teste para a funcionalidade de exportação de transações, seguindo os princípios de Test-Driven Development (TDD).

## 1. Cenários Positivos (Caminho Feliz)

### Cenário 1.1: Exportação Bem-Sucedida com Dados
- **Dado:** Que existem transações cadastradas e exibidas no dashboard (ex: 3 transações).
- **Quando:** O usuário clica no botão "Exportar CSV".
- **Então:** 
  - Um arquivo CSV deve ser gerado.
  - O download deve iniciar automaticamente com o nome `transacoes-piggbank-YYYYMMDD.csv` (onde YYYYMMDD é a data atual).
  - O arquivo deve conter um cabeçalho: `Data, Tipo, Valor, Categoria`.
  - O arquivo deve conter as 3 linhas correspondentes às transações.

### Cenário 1.2: Respeito aos Filtros Aplicados
- **Dado:** Que o dashboard está filtrado para exibir apenas transações de "Saída".
- **Quando:** O usuário clica em "Exportar CSV".
- **Então:** O arquivo gerado deve conter apenas as transações do tipo "Saída" que estão visíveis na tela.

---

## 2. Cenários Negativos

### Cenário 2.1: Exportação sem Transações
- **Dado:** Que não existem transações para o período selecionado ou a lista está vazia.
- **Quando:** O usuário clica em "Exportar CSV".
- **Então:** 
  - O sistema deve exibir uma mensagem de erro amigável (ex: "Não há transações para exportar").
  - OU gerar um CSV contendo apenas o cabeçalho (conforme preferência de UX).
  - O download não deve prosseguir com um arquivo vazio de dados.

---

## 3. Casos de Borda (Edge Cases)

### Cenário 3.1: Caracteres Especiais na Categoria ou Descrição
- **Dado:** Uma transação com categoria contendo vírgulas ou aspas (ex: `Lazer, "Férias"`).
- **Quando:** O arquivo CSV é gerado.
- **Então:** O campo deve estar devidamente "escapado" (entre aspas duplas) para não quebrar a estrutura das colunas do CSV.

### Cenário 3.2: Valores com Decimais
- **Dado:** Uma transação com valor `1250.50`.
- **Quando:** O arquivo CSV é exportado.
- **Então:** O valor deve ser representado numericamente de forma que ferramentas como Excel o reconheçam corretamente (usando ponto ou vírgula conforme a localização configurada, preferencialmente ponto para CSV padrão).

### Cenário 3.3: Formatação de Data
- **Dado:** Transações em diferentes datas.
- **Quando:** O arquivo CSV é gerado.
- **Então:** As datas devem seguir estritamente o formato `YYYY-MM-DD`.

### Cenário 3.4: Codificação de Caracteres (Acentuação)
- **Dado:** Transações com acentuação (ex: `Alimentação`, `Crédito`).
- **Quando:** O arquivo CSV é aberto.
- **Então:** Os caracteres devem ser exibidos corretamente (uso de UTF-8 com BOM para compatibilidade com Excel).
