# Review Spec

## Spec Compliance

1. **Validação de query params no dashboard não segue o comportamento do Spec Doc**
   - Severidade: ALTO
   - Observação: `src/app/dashboard/page.tsx` aceita query params `from` e `to`, mas apenas valida se as strings parseiam para datas válidas. Não há tratamento de `from > to`, intervalo maior que 12 meses ou data futura no servidor, e o código devolve silenciosamente o range padrão em vez de sinalizar erro.
   - Sugestão: adicionar validação centralizada em `DashboardPage` ou em utilitários de `src/lib/date.ts` e retornar ou exibir um erro claro quando a query estiver inválida.

2. **Use of spec-defined date utilities is parcial**
   - Severidade: MÉDIO
   - Observação: `DashboardPage` usa `parse` de `date-fns` diretamente em vez de um wrapper/utilitário de `src/lib/date.ts`, quebrando a consistência do projeto e adicionando lógica dispersa.
   - Sugestão: mover parsing e validação de query params para `src/lib/date.ts` e reutilizar ali.

3. **Edge cases documentados no Spec Doc não têm cobertura de testes explícita**
   - Severidade: MÉDIO
   - Observação: não há testes do dashboard para intervalos inválidos, intervalo maior que 12 meses, data futura ou empty state provenientes de filtro.
   - Sugestão: criar testes unitários/integrados para esses cenários, incluindo comportamento do `DateRangeFilter` e do `DashboardPage` com query string inválida.

## Architecture

1. **Inconsistência de tipo/contrato em `DashboardPage`**
   - Severidade: MÉDIO
   - Observação: `DashboardPageProps` define `searchParams: Promise<{ from?: string; to?: string }>` enquanto o App Router usa um objeto síncrono. Isso sugere um tipo errado e pode quebrar a integração comum do Next.js.
   - Sugestão: alinhar com a tipagem padrão do App Router: `searchParams: { from?: string; to?: string }` e remover `await` desnecessário.

2. **Separação parcial de responsabilidades entre validação de URL e renderização**
   - Severidade: MÉDIO
   - Observação: a página conflita lógica de parsing/validação de query com renderização do layout, em vez de delegar ao domínio de data.
   - Sugestão: extrair a construção de `filters` e a validação de query para funções utilitárias em `src/lib/date.ts`.

## Code Quality

1. **Lógica de data duplicada e parsing direto em dois locais**
   - Severidade: MÉDIO
   - Observação: tanto `src/app/dashboard/page.tsx` quanto `src/components/dashboard/DateRangeFilter.tsx` usam parsing de datas e validações similares. Isso pode gerar divergência de comportamento futuro.
   - Sugestão: centralizar toda validação de intervalo e parsing no módulo `src/lib/date.ts`.

2. **Mensagens de validação inconsistentes**
   - Severidade: BAIXA / MÉDIO
   - Observação: `DateRangeFilter` valida apenas o primeiro erro encontrado e não cobre mensagens específicas para formato inválido ou campo vazio.
   - Sugestão: adicionar feedback mais robusto e validar também o formato de `from`/`to` antes de construir datas.

## Performance

- Nenhuma issue relevante identificada no diff.
- O uso atual de filtro em memória para mock data é aceitável no contexto do projeto, sem N+1 ou overfetching.

## Security & LGPD

- Nenhuma questão crítica encontrada nas mudanças atuais.
- Não há secrets hardcoded, logs de dados sensíveis ou manipulação direta de HTTP/Request/Response.

## Test Coverage

1. **Cobertura de negócios incompleta para validação de intervalo**
   - Severidade: ALTO
   - Observação: os testes em `src/lib/api.test.ts` exercitam os caminhos felizes de `getTransactions` e `getMetrics`, mas não cobrem intervalos inválidos, filtros vazios ou empty state.
   - Sugestão: adicionar testes para:
     - intervalo `from > to`
     - intervalo acima de 12 meses
     - data futura
     - filtro que resulta em 0 transações

2. **Ausência de testes para o componente `DateRangeFilter`**
   - Severidade: MÉDIO
   - Observação: o componente cliente de filtro tem validação e navegação de query params, mas não há testes visíveis dele nesta mudança.
   - Sugestão: criar testes de componente que validem o botão `Aplicar`, o botão `Limpar` e mensagens de erro.

## Resumo

A implementação está alinhada com o escopo principal do Spec Doc: existe UI de filtro, o intervalo padrão é mantido, e as métricas/tabella são filtradas pelo mesmo range. Os principais riscos estão na validação de query string no servidor/página e na falta de cobertura de testes para edge cases documentados.
