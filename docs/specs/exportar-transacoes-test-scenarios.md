# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação Bem-Sucedida com Transações

* **Dado:** Existem transações exibidas no dashboard.
* **E:** O botão “Exportar CSV” está visível.
* **Quando:** O usuário clica em “Exportar CSV”.
* **Então:** Um arquivo CSV é gerado automaticamente.
* **E:** O download é iniciado automaticamente.
* **E:** O nome do arquivo segue o padrão `transacoes-piggbank-YYYYMMDD.csv`.
* **E:** O CSV contém as colunas:

  * `Data`
  * `Tipo`
  * `Valor`
  * `Categoria`
* **E:** Os dados exportados correspondem às transações exibidas na tela.

---

## Cenário 2: Exportação Considerando Filtros Aplicados

* **Dado:** Existem filtros aplicados no dashboard (ex.: período ou categoria).
* **Quando:** O usuário clica em “Exportar CSV”.
* **Então:** Apenas as transações filtradas são exportadas.
* **E:** O conteúdo do CSV corresponde exatamente aos dados visíveis na tabela.

---

## Cenário 3: Formatação Correta do CSV

* **Dado:** Existem transações válidas no dashboard.
* **Quando:** O CSV é exportado.
* **Então:** O arquivo utiliza codificação UTF-8.
* **E:** O separador utilizado é vírgula `,`.
* **E:** A coluna `Data` segue o formato `YYYY-MM-DD`.
* **E:** A coluna `Tipo` contém apenas `Entrada` ou `Saída`.
* **E:** A coluna `Valor` contém apenas valores numéricos.
* **E:** A coluna `Categoria` contém texto válido.

---

## Cenário 4: Download Automático do Arquivo

* **Dado:** Existem transações disponíveis.
* **Quando:** O usuário exporta o CSV.
* **Então:** O download do arquivo inicia automaticamente sem redirecionamento de página.
* **E:** O usuário não precisa realizar ações adicionais para salvar o arquivo.

---

# Cenários Negativos

## Cenário 5: Exportação Sem Transações

* **Dado:** Não existem transações exibidas no dashboard.
* **Quando:** O usuário clica em “Exportar CSV”.
* **Então:** O sistema:

  * gera um CSV contendo apenas os cabeçalhos vazios;
  * **ou** exibe mensagem informando que não há transações para exportar.

---

## Cenário 6: Erro na Geração do CSV

* **Dado:** Existe uma falha interna durante a geração do arquivo.
* **Quando:** O usuário tenta exportar o CSV.
* **Então:** O download não é iniciado.
* **E:** Uma mensagem de erro amigável é exibida ao usuário.
* **E:** O estado do dashboard permanece inalterado.

---

## Cenário 7: Erro de Permissão do Navegador

* **Dado:** O navegador bloqueia downloads automáticos.
* **Quando:** O usuário exporta o CSV.
* **Então:** O sistema informa que o download foi bloqueado.
* **E:** O usuário recebe instruções para permitir o download.

---

# Cenários de Edge Cases

## Cenário 8: Caracteres Especiais no CSV

* **Dado:** Existem categorias com caracteres especiais (`Alimentação`, `Transferência/Pix`, `João & Maria`).
* **Quando:** O CSV é exportado.
* **Então:** Os caracteres especiais são preservados corretamente no arquivo.
* **E:** O CSV mantém compatibilidade UTF-8.

---

## Cenário 9: Valores com Casas Decimais

* **Dado:** Existem transações com valores decimais (`10.50`, `1999.99`).
* **Quando:** O usuário exporta o CSV.
* **Então:** Os valores são exportados corretamente sem truncamento.

---

## Cenário 10: Datas em Diferentes Períodos

* **Dado:** Existem transações de anos e meses diferentes.
* **Quando:** O CSV é exportado.
* **Então:** Todas as datas seguem consistentemente o formato `YYYY-MM-DD`.

---

## Cenário 11: Grande Volume de Transações

* **Dado:** Existem milhares de transações exibidas no dashboard.
* **Quando:** O usuário exporta o CSV.
* **Then:** O arquivo é gerado corretamente.
* **E:** O sistema mantém desempenho aceitável.
* **E:** O download é concluído sem corrupção de dados.

---

## Cenário 12: Campos Vazios em Transações

* **Dado:** Existe uma transação sem categoria preenchida.
* **Quando:** O CSV é exportado.
* **Então:** O campo correspondente é exportado vazio.
* **E:** A estrutura do CSV permanece válida.

---

## Cenário 13: Integridade do Estado da Aplicação

* **Dado:** O dashboard possui métricas e filtros ativos.
* **Quando:** O usuário exporta o CSV.
* **Então:** Nenhuma métrica é alterada.
* **E:** Os filtros permanecem aplicados.
* **E:** Nenhum estado do app é modificado após a exportação.
