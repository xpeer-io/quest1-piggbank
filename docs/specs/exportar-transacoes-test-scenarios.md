# Cenários de Teste — Exportar Transações (CSV)

Objetivo: validar a funcionalidade de exportação CSV das transações exibidas no dashboard, garantindo formato, codificação e comportamento conforme requisitos.

Requisitos relevantes:
- Gatilho: botão "Exportar CSV" ao lado da tabela de transações.
- Deve exportar as transações atualmente exibidas (respeitando filtros).
- CSV: colunas `Data` (YYYY-MM-DD), `Tipo` (Entrada/Saída), `Valor` (número), `Categoria` (string).
- Codificação UTF-8 com BOM; delimitador `,` (vírgula); quebras CRLF.
- Nome do arquivo: `transacoes-piggbank-YYYYMMDD.csv` (data do download).
- Se não houver transações, gerar CSV com cabeçalhos ou apresentar mensagem de erro (definir comportamento esperado).

Estrutura dos cenários: para cada caso, descreve-se Pré-condição, Passos, Resultado Esperado e Observações.

---

## Cenários Positivos

1) Exportação com múltiplas transações
- Pré-condição: Há 10 transações visíveis no período/filtros aplicados (mescla de `income` e `expense`).
- Passos:
  1. Abrir dashboard com as transações filtradas.
  2. Clicar no botão `Exportar CSV`.
- Resultado Esperado:
  - O browser inicia download automático de `transacoes-piggbank-YYYYMMDD.csv`.
  - O CSV contém 11 linhas: 1 cabeçalho + 10 linhas de dados.
  - Colunas exatamente: `Data,Tipo,Valor,Categoria` (nessa ordem).
  - `Data` no formato `YYYY-MM-DD` (ex.: `2026-05-29`).
  - `Tipo` com valores `Entrada` para `income` e `Saída` para `expense`.
  - `Valor` numérico: valor positivo para entrada, negativo para saída (ex.: `1200.5`, `-200`).
  - Arquivo em UTF-8 com BOM; campos que contenham vírgulas/aspas/quebras estão corretamente escapados.

2) Exportação com uma única transação
- Pré-condição: Apenas 1 transação visível.
- Passos: clicar em `Exportar CSV`.
- Resultado Esperado: arquivo com 2 linhas (cabeçalho + 1 linha) e os formatos conforme especificado.

3) Exportação respeitando filtros (por data / categoria)
- Pré-condição: Aplicar filtro de data que deixe um subconjunto de transações visíveis.
- Passos: clicar em `Exportar CSV`.
- Resultado Esperado: CSV contém apenas as transações exibidas (mesmo subconjunto filtrado).

---

## Cenários Negativos

4) Exportação quando não há transações (comportamento definido: gerar CSV com cabeçalho)
- Pré-condição: Nenhuma transação visível para o período filtrado.
- Passos: clicar em `Exportar CSV`.
- Resultado Esperado (comportamento atual preferido):
  - Inicia download de um CSV contendo apenas a primeira linha com os cabeçalhos `Data,Tipo,Valor,Categoria` e nenhuma linha de dados.
  - Arquivo válido (UTF-8 BOM, delimitador vírgula).
- Observação alternativa (se política for mostrar erro): o app pode exibir um toast/alerta "Não há transações para exportar" e não iniciar download — escolha clara deve ser alinhada com product.

5) Falha no processo de criação do Blob / permissão de download
- Pré-condição: Simular erro no ambiente (ex.: armazenamento de blob indisponível, bloqueio do navegador).
- Passos: clicar em `Exportar CSV`.
- Resultado Esperado:
  - O app não trava; deve haver tratamento (idealmente exibir mensagem de erro amigável).
  - Nenhum arquivo é baixado.

---

## Cenários de Edge Cases

6) Transações com caracteres especiais (vírgulas, aspas, quebras de linha, acentos)
- Pré-condição: 1 transação com `description`/`category` que contenha vírgula, aspas duplas e quebra de linha, ex.: `Categoria: "Alimentação, Restaurante"` e descrição com `Linha1\nLinha2`.
- Passos: exportar CSV.
- Resultado Esperado:
  - Campos contendo caracteres especiais são corretamente escapados segundo RFC CSV: aspas internas duplicadas e campo entre aspas.
  - Ao abrir no Excel, o conteúdo aparece íntegro (sem colunas adicionais causadas por vírgulas internas).
  - A codificação UTF-8 com BOM garante exibição correta de acentos.

7) Datas inválidas ou malformadas
- Pré-condição: transação com `date` nulo, string inválida ou timestamp inválido.
- Passos: exportar CSV.
- Resultado Esperado:
  - No CSV, o campo `Data` fica vazio (`""` ou vazio dependendo do escopo de escaping) para entradas inválidas.
  - O processo não quebra; todas as outras colunas são exportadas normalmente.

8) Valores muito grandes / precisão
- Pré-condição: transações com valores muito grandes ou com muitas casas decimais.
- Passos: exportar CSV e abrir em editor de texto/Excel.
- Resultado Esperado:
  - `Valor` é representado como número no CSV (ex.: `1234567890123.45`).
  - Observação: Excel pode representar números grandes em notação científica — se isso for indesejado, considerar exportar como texto formatado.

9) Campos ausentes (categoria faltando)
- Pré-condição: transação sem `category` ou campo undefined.
- Passos: exportar CSV.
- Resultado Esperado: campo `Categoria` vazio na linha correspondente; demais campos presentes.

10) Locale / delimitador inesperado
- Pré-condição: usuário em locale que costuma usar `;` como delimitador (Brasil/Excel em alguns setups).
- Passos: exportar CSV.
- Resultado Esperado:
  - CSV é gerado com `,` conforme requisito; no entanto, validar manualmente se Excel local importa corretamente. Se houver problemas recorrentes, product pode escolher `;` como delimitador para compatibilidade regional.

---

## Casos de Teste Automáticos Sugeridos
- Unit test do util `exportToCSV`:
  - Entrada: array de objetos com campos `Data,Tipo,Valor,Categoria` e valores com vírgulas/aspas/quebras.
  - Asserções: string CSV gerada contém BOM; cabeçalho correto; linhas corretamente escapadas; CRLF em quebras.
- E2E (Playwright / Cypress):
  - Cenário: carregar page com transações mockadas, clicar botão `Exportar CSV`, interceptar download e validar conteúdo do arquivo e nome do arquivo.

---

## Observações e decisões abertas
- Comportamento ao não haver transações: atualmente sugerimos gerar CSV com apenas cabeçalhos (mais previsível para automação). Alternativa: mostrar mensagem e não baixar — decidir com product.
- Exportar `Valor` como número facilita reuso em planilhas; se for necessário preservar formatação (ex.: símbolo de moeda), criar coluna adicional `ValorFormatado`.

Arquivo criado pela equipe para documentar cenários de teste da funcionalidade "Exportar CSV".
