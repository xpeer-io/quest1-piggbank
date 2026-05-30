# PRD: Filtro de Período no Dashboard

## Contexto
Atualmente o dashboard financeiro do piggbank mostra métricas usando um intervalo fixo de últimos 30 dias. O objetivo desta feature é permitir que o usuário selecione manualmente uma data de início e uma data de fim para filtrar todas as métricas exibidas no dashboard.

## Objetivo da Feature
Permitir que o usuário visualize métricas do dashboard para um intervalo de datas personalizado, mantendo consistência entre todos os cards e tabelas exibidos.

## Problema que resolve
- O usuário não consegue analisar períodos específicos além dos últimos 30 dias.
- O dashboard atual não suporta comparação de períodos personalizados.
- Isso limita decisões de negócio e diagnóstico financeiro em intervalos relevantes para o usuário.

## Benefício esperado
- Usuário consegue consultar receitas, despesas, saldo e transações em qualquer período válido.
- A análise de tendências e anomalias fica mais precisa e relevante.
- Reduz a fricção em cenários de auditoria, fechamento de mês ou análise de campanhas específicas.

## Principais perguntas de borda
1. O intervalo deve ser inclusivo em ambas as extremidades (data início e fim)?
2. Qual é a data mínima e máxima permitida no filtro? Deve haver limite por dados disponíveis ou por desempenho?
3. Como lidar com `data início` posterior a `data fim`? Deve ser bloqueado, invertido automaticamente ou sinalizado como erro?
4. O filtro deve permitir seleção de apenas uma data (início = fim) para ver métricas de um único dia?
5. Qual é o comportamento quando o usuário limpa o filtro? Volta automaticamente para os últimos 30 dias?
6. O estado do filtro deve ser preservado entre reloads, sessões do usuário ou apenas enquanto o app está aberto?
7. Há necessidade de filtros pré-definidos (hoje, ontem, esta semana, este mês) além do range manual?
8. Como validar datas inválidas, formato incorreto ou seleção incompleta no cliente e no servidor?
9. Se não houver transações no intervalo selecionado, o dashboard deve exibir um estado vazio específico ou apenas zero em métricas?
10. O filtro deve afetar apenas o dashboard atual ou também outras telas de relatório/analytics no produto?
11. Como o filtro deve se comportar em caso de fuso horário do usuário diferente do servidor?
12. Há exigência de rastrear o uso do filtro para métricas de produto (telemetria)?
13. O filtro deve ser aplicável apenas para métricas agregadas ou também para a tabela de transações exibida?
14. Precisamos suportar “intervalo máximo” para evitar query pesada em 12 meses ou mais?
15. O componente deve ser acessível via teclado e compatível com leitores de tela?

## Riscos
### Riscos técnicos
- Falha na normalização de datas entre cliente e servidor pode gerar resultados incorretos ou off-by-one nos limites.
- Uso indevido de `new Date()` em UI pode quebrar comportamento de fuso horário; precisamos usar `src/lib/date.ts` e `date-fns` como padrão.
- Filtros extensos podem sobrecarregar cálculos de métricas se houver processamento ineficiente ou falta de cache.
- Componentização inconsistende pode levar a duplicação de lógica de filtro entre dashboard e outras telas.

### Riscos de negócio
- Usuário pode interpretar resultados como incompletos se dados não corresponderem exatamente ao intervalo selecionado.
- Se o filtro não for claro, o usuário pode aplicar intervalos incorretos e tomar decisões erradas.
- Alteração da experiência do dashboard pode aumentar suporte/treinamento se não houver indicação clara do intervalo ativo.

### Riscos operacionais
- Sem rollout gradual, a mudança pode impactar muitos usuários ao mesmo tempo.
- Dependência de dados históricos incompletos pode causar consultas vazias ou métricas inconsistentes.
- Falta de monitoramento específico do uso do filtro dificulta a detecção de regressões na feature.

## Constraints que precisam de definição antes do Spec Doc
- Limites de intervalo: quantos dias/meses máximos o filtro deve permitir? Existe regra de performance ou produto?
- Comportamento padrão ao abrir o dashboard: deve continuar em últimos 30 dias, aplicar intervalo salvo ou manter último filtro do usuário?
- Regras de validação de datas: `start <= end`, datas futuras permitidas, limites mínimos e máximos.
- Escopo exato do filtro: apenas métricas do dashboard ou também lista de transações e eventuais cartões derivados?
- Persistência do estado: local storage, perfil do usuário, parêmetro de URL ou apenas memória de navegação?
- UX desejado: componente separado, drop-down de datas, botão de aplicar, mensagens de erro inline, presets de período.
- Critérios de aceite em caso de intervalo vazio ou sem transações.
- Necessidade de feature flag e rollout progressivo.
- Requisitos de acessibilidade para o componente de seleção de período.
- Dependência de design ou guidelines visuais do produto.

## Premissas
- O dashboard já usa `src/lib/api.ts` para buscar dados e `src/lib/metrics.ts` para calcular métricas.
- A feature deve respeitar padrões do projeto: componentes UI em `src/components/ui/`, Server Components por padrão e uso de `date-fns`/`src/lib/date.ts` para manipular datas.
- O filtro será implementado inicialmente sem alterações de banco de dados, usando dados já disponíveis no backend ou gerado no frontend.

## Entregáveis esperados desta discovery
- Documento PRD com perguntas de borda, riscos e constraints.
- Um Spec Doc baseado nesse PRD que defina escopo, APIs e critérios de aceite.
- Implementação do componente de filtro de período e integração com o dashboard.

## Próximos passos
1. Validar as constraints de intervalo e persistência com o time de produto.
2. Confirmar se o filtro deve afetar apenas o dashboard ou também outros relatórios.
3. Definir UX/Design do controle de seleção de período e presets necessários.
4. Criar `docs/specs/SPEC-filtro-periodo.md` com o escopo detalhado, critérios de aceite e estratégia de testes.
