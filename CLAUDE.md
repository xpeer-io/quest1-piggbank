# piggbank — Regras do projeto para agentes IA

## Stack e versões

- Next.js 16 (App Router, Turbopack) — sem Pages Router
- TypeScript 5 strict — sem `any`
- Tailwind CSS v4 + shadcn/ui
- Vitest + Testing Library
- date-fns v3 para manipulação de datas

## Como rodar

```bash
npm install
npm run dev       # desenvolvimento
npm test          # testes
npm run build     # build de produção
```

## Padrões obrigatórios

- **Acesso a dados:** sempre via `src/lib/api.ts` — nunca importar `mockTransactions` diretamente em páginas ou componentes
- **Datas:** sempre via funções de `src/lib/date.ts` — nunca `new Date()` diretamente na UI
- **Métricas:** sempre derivadas de transações via `src/lib/metrics.ts` — nunca valores hardcoded
- **Componentes UI:** usar shadcn/ui (`src/components/ui/`) — não criar do zero o que já existe lá
- **Server Components** por padrão; `"use client"` apenas quando necessário

## Tracker de tickets

- Projeto: ClickUp — espaço **piggbank**
- Prefixo de tickets: `piggbank-`

## Spec Docs

- Template: `templates/spec-doc.md`
- Destino: `docs/specs/[ticket-id]-[slug].md`

## Testes

- Coverage mínimo: 80% em código novo
- Escopo do coverage: `src/lib/**` e `src/components/dashboard/**`
- Arquivos excluídos: `src/components/ui/**`, `src/data/**`, `src/app/**`, `src/lib/utils.ts`
