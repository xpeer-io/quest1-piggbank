# PRD: Filtro por Período — Dashboard Piggbank

Resumo
-------
Permitir que o usuário selecione uma data de início e uma data de fim para filtrar todas as métricas exibidas no dashboard. Hoje o dashboard mostra sempre os últimos 30 dias; esta feature adiciona controle explícito de período para análises históricas e comparações.

Objetivos
---------
- Oferecer seleção de período (data início + data fim) no dashboard.
- Garantir que todas as métricas e tabelas respeitem o intervalo selecionado.
- Manter performance aceitável para intervalos grandes e impedir cargas indesejadas.

Sucesso (Métricas)
-------------------
- Adoção: % de usuários que usam filtro personalizado vs padrão (30 dias).
- Performance: tempo médio de resposta < 2s para intervalos até 1 ano.
- Precisão: consistência entre números exibidos e fonte de dados (0 divergência tolerada).

Usuários alvo
------------
- Usuários do dashboard financeiro que precisam visualizar métricas fora dos últimos 30 dias.

Requisitos Funcionais (principais)
---------------------------------
1. Interface: apresentar um controle de data com `startDate` e `endDate` no header do dashboard.
2. Validação: `startDate` não pode ser posterior a `endDate`; `endDate` não pode ser futura (opcional: permitir até hoje).
3. Aplicação: todas as métricas, gráficos e tabelas devem recarregar com os dados do intervalo selecionado.
4. Padrão: se o usuário não selecionar nada, manter o comportamento atual (últimos 30 dias).
5. Estado: persistir temporariamente a seleção de período durante a sessão (localStorage ou estado de rota) e opcionalmente por usuário (configuração futura).
6. Quick Presets: oferecer presets rápidos (últimos 7, 30, 90 dias; mês atual; ano até hoje).
7. Export/Compartilhamento: filtros devem ser refletidos em exportações e URLs (query params) para compartilhamento.

Requisitos Não-Funcionais
-------------------------
- Performance: paginar ou agregar dados quando o intervalo for muito grande para evitar timeouts.
- Segurança: validação server-side dos parâmetros de data para evitar injeção maliciosa.
- Acessibilidade: o seletor de datas deve ser acessível por teclado e leitores de tela.

Fluxos de UX (resumido)
-----------------------
- Usuário abre dashboard → vê intervalo atual (últimos 30 dias) → clica no seletor de período → escolhe `start` e `end` → aplica → dashboard atualiza.
- Se compartilhar URL, incluir `?start=YYYY-MM-DD&end=YYYY-MM-DD` para recriar o estado.

Critérios de Aceite
-------------------
- Seleção de período disponível e visível no dashboard.
- Todas as visualizações refletem corretamente as datas escolhidas.
- Presets funcionam e podem ser selecionados com um clique.
- URL reproduz o estado do filtro quando parâmetros são fornecidos.
- Testes automatizados cobrindo validações e integração com as principais métricas.

Perguntas de Borda (edge cases) — do Discovery
---------------------------------------------
- Como tratar fusos horários dos usuários? Os timestamps são sempre UTC?
- Permitir `endDate` futura (ex.: planejamento) ou limitar a hoje?
- Como lidar com intervalos muito grandes (ex.: > 3 anos)? Agregar por mês/ano automaticamente?
- Se o período selecionado não tiver dados (ex.: conta nova), qual mensagem mostrar?
- Como combinar com outros filtros (categoria, conta, tag)? Ordem de avaliação dos filtros?
- Comportamento para datas inválidas na URL: redirecionar para padrão ou mostrar erro?
- Permitir seleção por granularidade (dia/semana/mês) ou é sempre diário?

Riscos
------
- Técnico: carga elevada no backend se usuários solicitarem intervalos longos sem agregação.
- Negócio: números divergentes causam perda de confiança se não estiver claro como os dados são agregados.
- Operacional: migração de caches e índices pode ser necessária para consultas eficientes sobre grandes janelas.

Constraints (decisões que precisamos antes do Spec)
--------------------------------------------------
- Definir limite máximo de intervalo antes de aplicar agregação automática.
- Decidir política de timezone (UTC vs local do usuário).
- Escolher persistência do filtro (apenas sessão vs persistente por usuário).
- Especificar formato da serialização em URL (`YYYY-MM-DD` e timezone implicado).

Dependências técnicas
---------------------
- Endpoints da API devem aceitar `start` e `end` e retornar dados agregados quando aplicável.
- Cache/DB: avaliar índices e queries para suporte a filtros por período.

Plano de rollout
----------------
1. Implementação UI + parametrização de API (canary interno).
2. Testes de performance com intervalos curtos e longos.
3. Habilitar para % pequeno de usuários e monitorar métricas.
4. Escalar rollout após validação.

Próximos passos (imediatos)
---------------------------
- Definir limites e política de timezone (necessário para o Spec).
- Criar Spec Doc técnico detalhando endpoints, contratos e exemplos de payload.
- Prototipar componente de seleção de datas e presets.

Origem
------
Baseado em [docs/prompts/ex1-discovery.md](docs/prompts/ex1-discovery.md#L1).
