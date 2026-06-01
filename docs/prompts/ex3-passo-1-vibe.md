Implemente um filtro de período no dashboard financeiro do projeto piggbank.

Contexto: 
- O dashboard atualmente mostra os últimos 30 dias
- Os dados já estão carregados no frontend
- Utilizar date-fins para manipulação de dados (conforme CLAUDE.md)

Requisitos: 
- Permitir selecionar data inicial e data final 
- Validar que a data inicial não pode ser maior que a data final
- Filtrar as transações exibidas com base no período selecionado
- Caso não haja dados no período, exibir mensagem "Nnenhum dado encontrado""
- As datas devem estar no formato ISO (YYYY-MM-DD)

UI:
- Utilizar componentes do shadcn/ui
- Criar um seletor de intervalo de datas (DateRangePicker)

Estados:
- Loading ao aplicar filtro
- Erro quando data inicial > data final
- Estado vazio quando não houver dados