# Cenários de Teste: Exportação de Transações em CSV (Versão Gemini)

## 🎯 Visão Geral
Este documento define os critérios de aceite para a funcionalidade de exportação de transações, servindo de base para o desenvolvimento guiado por testes (TDD).

## 🛠 Cenários de Teste

### Cenário 1: Formatação de Valores CSV (Unidade)
- **Dado:** Um valor de texto ou número.
- **Quando:** Passado pela função de escape de CSV.
- **Então:** 
  - Strings com vírgula devem ser envolvidas em aspas.
  - Aspas duplas internas devem ser duplicadas (`"` -> `""`).
  - Números devem ser formatados com duas casas decimais.
  - Caracteres acentuados (UTF-8) devem ser preservados.

### Cenário 2: Geração de Conteúdo CSV (Lógica)
- **Dado:** Uma lista de transações com diferentes tipos (income/expense) e categorias.
- **Quando:** O conteúdo CSV é gerado.
- **Então:**
  - A primeira linha deve conter o cabeçalho: `Data,Tipo,Valor,Categoria`.
  - O tipo `income` deve ser mapeado para `Entrada`.
  - O tipo `expense` deve ser mapeado para `Saída`.
  - As datas devem seguir o formato `YYYY-MM-DD`.

### Cenário 3: Exportação com Lista Vazia
- **Dado:** Uma lista sem transações.
- **Quando:** O download é solicitado.
- **Então:** O arquivo deve conter apenas o cabeçalho.

### Cenário 4: Comportamento do Botão (UI)
- **Dado:** O componente `ExportCsvButton`.
- **Quando:** Renderizado no dashboard.
- **Então:**
  - Deve exibir o texto "Exportar CSV".
  - Deve estar desabilitado se a lista de transações estiver vazia.
  - Deve chamar a função de download ao ser clicado.

### Cenário 5: Nome do Arquivo
- **Dado:** Uma solicitação de download em uma data específica.
- **Quando:** O arquivo é gerado.
- **Então:** O nome deve seguir o padrão `transacoes-piggbank-YYYYMMDD.csv`.
