## Projeto: piggbank

Dashboard financeiro para PMEs. Exibe métricas de faturamento, despesas e fluxo de caixa com filtros por período.

## Stack

- Framework: Next.js 16 (App Router, Turbopack)
- Linguagem: TypeScript 5 strict
- UI: Tailwind CSS + shadcn/ui
- Testes: Vitest + Testing Library
- Dados: mock em `src/data/mock.ts`

## Decisões de arquitetura

- Server Components por padrão; Client Components apenas para interatividade
- Datas sempre em UTC; conversão para timezone do usuário só na UI
- Métricas derivadas dinamicamente das transações via `src/lib/metrics.ts`
- Acesso a dados centralizado em `src/lib/api.ts` — nunca importar mock diretamente nas páginas

## Estrutura de pastas

src/
├── app/ ← Rotas (App Router)
│ └── dashboard/ ← Dashboard principal
├── components/
│ ├── ui/ ← Componentes base shadcn
│ └── dashboard/ ← Componentes específicos do produto
├── lib/
│ ├── api.ts ← Funções de acesso a dados (async, prontas para filtro)
│ ├── date.ts ← Utilitários de data (date-fns)
│ └── metrics.ts ← Derivação de métricas a partir de transações
└── types/ ← Tipos globais

## O que NÃO está neste projeto

- Sem autenticação
- Sem banco de dados real (dados mockados em `src/data/mock.ts`)
- Sem i18n
- Sem SSE ou WebSockets
- Sem exportação de relatórios (planejado para Q3)
