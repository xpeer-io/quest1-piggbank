# Rules do Projeto — piggbank

## Código

- TypeScript strict mode sempre
- Sem `any` — use `unknown` + type narrowing
- Nomes descritivos em inglês (variáveis, funções, classes)
- Self-documenting code — sem comentários óbvios
- Early returns para reduzir nesting

## Stack e padrões

- Manipulação de datas exclusivamente via `date-fns` (nunca `new Date()` diretamente na UI)
- Utilitários de data centralizados em `src/lib/date.ts`
- Componentes de UI via shadcn/ui — não criar do zero o que já existe lá
- Server Components por padrão; `"use client"` apenas quando necessário (interatividade, hooks)

## Segurança

- Validar todo input de usuário com Zod
- Secrets em environment variables — nunca hardcoded
- Nunca logar PII, senhas ou tokens

## Testes

- Coverage ≥80% em código novo
- Testar happy path + error path + edge cases
- Nomes de teste descritivos (describe/it)

## Workflow

- Antes de gerar código: fazer Research no projeto (ler código existente, padrões, tipos)
- Seguir padrões já estabelecidos no projeto — não inventar novos sem justificativa
- PRs pequenos (< 400 linhas)
