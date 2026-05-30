# PRD — Filtro de Período

Data: 2026-05-21

## Resumo

Este documento consolida os resultados da discovery para o recurso "Filtro de Período" do dashboard (Visão Geral). Ele define restrições, critérios de aceitação, contrato de API, UX básico, requisitos de performance e plano de testes para que a equipe possa escrever a Spec Doc e implementar com segurança.

## Objetivo

- Permitir que o usuário selecione um intervalo de datas para filtrar métricas e transações.
- Garantir comportamento previsível (validação, performance, compatibilidade mobile e reprodutibilidade via URL).

## Escopo

- UI do dashboard: selector de intervalo (presets + custom range).
- Backend/API: aceitar filtro de data e retornar transações e métricas filtradas.
- Recalcular métricas e atualizar tabelas/gráficos com base no intervalo.

Não faz parte do escopo inicial: permissões multi-usuário por organização, agendamento de relatórios, exportação CSV (pode ser follow-up).

## Restrições e decisões a definir (essenciais antes da Spec Doc)

1. Escopo e critérios de aceite
   - Definir comportamentos obrigatórios e casos de borda (ex.: intervalo vazio, intervalo muito grande, datas inválidas).

2. Formato e timezones
   - Formato de transporte: usar `yyyy-MM-dd` (ISO date) em query params.
   - Normalização: Backend deve interpretar as datas como início/fim do dia em UTC ou documentar timezone usado.

3. Inclusão/exclusão de limites
   - Especificar se `from`/`to` são inclusivos (`>= from && <= to`) — recomendado: inclusivos.

4. Validação de datas futuras
   - Regra: bloquear seleção de datas futuras no client; o backend deve também rejeitar/ignorar ranges com `from > now`.

5. Persistência do filtro
   - Mecanismo preferido: `query params` (ex.: `?from=2026-05-01&to=2026-05-21`) para links reprodutíveis. `localStorage` opcional como fallback UX.

6. Limites máximos de intervalo
   - Definir máximo permitido (ex.: 12 meses) e comportamento (bloquear seleção ou aplicar truncamento automático).

7. Comportamento mobile
   - Layout responsivo: um calendário por vez ou `input[type=date]` nativo; presets visíveis; modal em vez de popover.

8. Performance e indexação
   - Filtrar no backend para grandes volumes; exigir índice em coluna de data e paginar resultados.

9. API e query params
   - Contrato mínimo: GET /transactions?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&pageSize=50
   - Cabeçalhos de cache/time-to-live quando aplicável.

10. Atualização de métricas
    - Todas as métricas e gráficos dependentes devem recarregar quando o intervalo mudar; garantir atomicidade do update (tabela + métricas sincronizados).

11. UX presets e acessibilidade
    - Presets: Hoje, Últimos 7 dias, Últimos 30 dias, Últimos 90 dias, Mês atual.
    - Mensagens de erro claras e foco acessível; componentes com labels e roles ARIA.

12. Testes e dados mock
    - Casos de teste: intervalo normal, limites inclusivos, futuro, intervalo máximo, sem resultados.

13. Logs e telemetria
    - Logar filtros aplicados (hash/anonymized) e falhas de validação para análise de uso.

14. Paginação e ordenação
    - Especificar como combinar filtro com paginação e ordenação (ex.: ordenação por data desc padrão).

## Acceptance Criteria (mínimos)

- O usuário consegue selecionar intervalo customizado e presets.
- Backend retorna apenas transações dentro do intervalo definido (inclusive endpoints).
- Métricas (faturamento, despesas, lucro, contador de transações) atualizam de forma consistente com o intervalo.
- Datas futuras são bloqueadas no client; backend valida e retorna 400 se receber `from > now` (opcional: tratar como vazio).
- Estado do filtro é refletido na URL via query params.
- Comportamento responsivo: interface usável em mobile (single column/modal).

## Contrato de API proposto

- Endpoint: `GET /api/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&pageSize=50`
- Resposta:

```json
{
  "metrics": [ { "label": "Faturamento", "value": 12345, "currency": true }, ... ],
  "transactions": [ { "id":"1", "date":"2026-05-10", "amount":12000, ... } ],
  "pagination": { "page":1, "pageSize":50, "total":123 }
}
```

Notas:
- `from` e `to` são datas sem tempo; servidor deve interpretar `from` como startOfDay e `to` como endOfDay antes de filtrar.

## UX / Design (alto nível)

- Desktop: botão/pill com label do período; ao clicar abre popover com:
  - presets na parte superior
  - dois calendários lado a lado (from/to) ou seleção range única
  - botões "Cancelar" e "Aplicar"
- Mobile: modal full-screen com um calendário (um mês por vez) ou inputs nativos; presets fixos acima do calendário.
- Feedback: mostrar badge "Sem resultados" quando não houver transações; mostrar loader enquanto dados carregam.

## Validação e mensagens

- Se `from > to`: mostrar erro inline e desabilitar "Aplicar".
- Se `to` for futura: bloquear seleção ou avisar "Selecione até a data atual".
- Se intervalo exceder máximo permitido: mostrar aviso e impedir aplicar.

## Performance & Escalabilidade

- Recomendado: filtrar no banco (WHERE date BETWEEN startOfDay(from) AND endOfDay(to)).
- Garantir índice em coluna de data; paginar respostas; limitar pageSize por padrão.

## Testes sugeridos

- Unit tests para validação de datas (inclusive/exclusive, futuro, max range).
- Integration tests API: garantir retorno correto para vários ranges.
- E2E: seleções via UI (presets, custom range, mobile flow), comportamento de URL e reload.

## Telemetria e logs

- Capturar evento `filter_applied` com: preset|custom, from, to, duration(ms) do request, resultCount.
- Registrar falhas de validação separadamente (bad_request).

## Rollout e migração

- Implementar feature flag para ativar o filtro por fases.
- Começar com client-side + mocks; depois mover filtro para backend com índices.

## Open Questions

- Desejamos aceitar horários (datetime) no futuro ou apenas datas? (recomendado: apenas datas inicialmente)
- Limite máximo exato do range (12 meses sugerido) — confirmar com PM.
- Política para ranges que não retornam dados: mostrar sugestão de presets?

## Próximos passos

1. Confirmar decisões nas seções acima (timezones, inclusividade, persistência, limite máximo).
2. Escrever Spec Doc detalhada com API examples e mock responses.
3. Implementar PoC client + testes unitários e e2e.


---
Documento gerado a partir da discovery conduzida em 2026-05-21.
