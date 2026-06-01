Implemente o componente DateRangeFilter para o dashboard financeiro do projeto piggbank.
Contexto: 
- O dashboard atualmente exibe transações do últimos 30 dias
- Os dados já estão carregados no frontend
- O filtro será aplicado no frontend (conforme decisão do SPEC)
- Utilizar date-fins para manipulação de datas (conforme CLAUDE.md)
- Utilizar componentes de UI do shadcn/ui

Requisitos: 
- Permitir seleção de data inicial (startDate) e data final (endDate) 
- Validar que a data inicial não pode ser maior que a data final
- Filtrar as transações exibidas com base no período selecionado
- Caso não haja dados no período, exibir mensagem "Nnenhum dado encontrado""
- As datas devem estar no formato ISO (YYYY-MM-DD)

Componente:
- Criar componente DateRangeFilter
- Utilizar DateRangePicker do shadcn/ui
- O componente deve emitir os valores selecionados para o dashboard

Esatdos:
- Loading ao aplicar filtro
- Erro quando startDate > endDate
- Estado vazio quando não houver dados

Integração:
- Consumir endpoint:
  GET /api/v1/transactions?startDate=YYYY-MM-DD&enddate=YYYY-MM-DD

Regras técnicas (CLAUDE.md):
- Não usar new Date() diretamente
- Usar funções de src/lib/date.ts
- Não acessar dados diretamente, usar src/lib/api.ts

Resultado esperado:
- Odashboard deve atualizar as métricas com base no período selecionado
