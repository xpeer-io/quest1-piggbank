# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação bem-sucedida
* Dado: o usuário tem transações válidas cadastradas no sistema
* Quando: o usuário solicita a exportação de transações em CSV
* Então: um arquivo CSV é gerado e baixado
* E: o arquivo contém todas as transações solicitadas com cabeçalho correto

## Cenário 2: Exportação com filtragem de período bem-sucedida
* Dado: o usuário seleciona um intervalo de datas válido e há transações nesse período
* Quando: ele solicita a exportação em CSV
* Então: o arquivo CSV contém apenas as transações do período selecionado
* E: as datas estão no formato esperado do sistema

## Cenário 3: Sem transações disponíveis
* Dado: não há transações cadastradas ou não há transações no período filtrado
* Quando: o usuário tenta exportar para CSV
* Então: o sistema informa que não há transações para exportar
* E: nenhum arquivo CSV é gerado

## Cenário 4: Erro ao gerar CSV
* Dado: ocorre uma falha do servidor ou erro interno durante a geração do arquivo
* Quando: o usuário solicita a exportação de CSV
* Então: o sistema mostra uma mensagem de erro clara
* E: o usuário pode tentar novamente sem perder os filtros aplicados

## Cenário 5: Exportação de transações com caracteres especiais
* Dado: há transações com descrições que contêm acentos, cedilhas e caracteres Unicode
* Quando: o usuário exporta para CSV
* Então: o arquivo CSV preserva corretamente os caracteres especiais
* E: o arquivo pode ser aberto sem corrupção em Excel/Google Sheets

## Cenário 6: Exportação de transações com vírgulas e quebras de linha nas descrições
* Dado: há transações cujas descrições contêm vírgulas e quebras de linha
* Quando: o usuário exporta essas transações para CSV
* Então: os campos são corretamente escapados ou encapsulados entre aspas
* E: o CSV mantém a integridade dos registros ao ser aberto em Excel/Google Sheets

## Cenário 7: Exportação de transações com datas variadas
* Dado: existem transações com datas em diferentes formatos internos e fusos horários
* Quando: o usuário exporta para CSV
* Então: as datas são normalizadas para o formato esperado no arquivo
* E: a informação de data permanece consistente e legível no Excel/Google Sheets

## Cenário 8: Exportação de transações com valores monetários
* Dado: existem transações com valores positivos, negativos e zero
* Quando: o usuário gera o CSV
* Então: os valores são exportados com separador decimal correto e sinal apropriado
* E: o arquivo é compatível com importação em planilhas financeiras

## Cenário 9: Exportação de grande volume de dados
* Dado: há centenas ou milhares de transações cadastradas
* Quando: o usuário solicita a exportação em CSV
* Então: o sistema gera o arquivo dentro de um tempo aceitável e sem travar
* E: o arquivo contém todas as transações e é consistente ao abrir em Excel/Google Sheets

## Cenário 10: Compatibilidade com Excel/Google Sheets
* Dado: o sistema gera o arquivo CSV com separadores e codificação padrão
* Quando: o arquivo é aberto no Excel ou Google Sheets
* Então: as colunas são carregadas corretamente sem quebras de campos indevidas
* E: os valores monetários, datas e textos aparecem no formato esperado
