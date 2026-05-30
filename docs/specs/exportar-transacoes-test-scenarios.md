# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação Bem-Sucedida
- Dado: Há transações exibidas no dashboard (com filtros aplicados, se houver).
- Quando: Usuário clica no botão `Exportar CSV`.
- Então: Um arquivo CSV é gerado e o download é iniciado com o nome `transacoes-piggbank-YYYYMMDD.csv`.
- E: O CSV contém colunas: `Date` (YYYY-MM-DD), `Type` (Entry/Exit), `Amount` (number), `Category` (string).

## Cenário 2: Sem Transações
- Dado: Nenhuma transação exibida.
- Quando: Usuário tenta exportar.
- Então: É gerado um CSV contendo apenas os cabeçalhos ou uma mensagem de erro amigável é exibida.

## Cenário 3: Transações com Caracteres Especiais
- Dado: Transações com nomes de categorias e descrições contendo acentos, vírgulas e caracteres especiais.
- Quando: Exporta para CSV.
- Então: O arquivo é codificado em UTF-8 e preserva corretamente os caracteres especiais, e campos contendo vírgulas são corretamente escapados.

## Cenário 4: Filtro de Período Aplicado
- Dado: Um filtro de período está ativo (ex: 2024-01-01 a 2024-01-31).
- Quando: Exporta para CSV.
- Então: O CSV contém somente as transações visíveis dentro do intervalo filtrado.

## Cenário 5: Nome do Arquivo
- Dado: Exportação realizada em 2024-12-31.
- Quando: O arquivo é gerado.
- Então: O nome do arquivo segue o padrão `transacoes-piggbank-20241231.csv`.

## Observações de Teste
- Separador: vírgula.
- Codificação: UTF-8.
- Verificar comportamento no caso de grandes quantidades de transações (performance não obrigatória neste exercício, mas útil).
