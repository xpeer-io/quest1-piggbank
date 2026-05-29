# Cenários de Teste: Exportação de Transações em CSV

## Cenário 1: Exportação Bem-Sucedida
- **Dado:** Transações existentes no dashboard.
- **Quando:** Usuário clica no botão "Exportar CSV".
- **Então:** Um arquivo CSV deve ser gerado contendo:
    - Colunas: Data (YYYY-MM-DD), Tipo (Entrada/Saída), Valor (número), Categoria (string).
    - O download deve ser iniciado automaticamente com o nome `transacoes-piggbank-YYYYMMDD.csv` (onde YYYYMMDD é a data atual).

## Cenário 2: Sem Transações
- **Dado:** Nenhuma transação disponível para exportação.
- **Quando:** O usuário clica no botão "Exportar CSV".
- **Então:** O sistema deve gerar um CSV apenas com os cabeçalhos ou exibir uma mensagem informando que não há dados para exportar.

## Cenário 3: Formatação de Dados
- **Dado:** Transações com valores decimais e categorias com caracteres especiais.
- **Quando:** Exportado para CSV.
- **Então:** Os valores devem ser preservados corretamente e o arquivo deve estar em codificação UTF-8 com separador vírgula.
