# Prompts dos Exercicios

## Ex 1 - Discovery

```text
Estamos na Fase 1 (Discovery) de uma feature de filtro de periodo no dashboard financeiro piggbank.

Feature: Hoje o dashboard mostra sempre os ultimos 30 dias. Queremos permitir que o usuario escolha uma data inicio e uma data fim para filtrar todas as metricas exibidas.

Quero que voce:
1. Faca perguntas de borda que ainda nao considerei
2. Identifique riscos (tecnico, negocio, operacional)
3. Liste constraints que precisam de definicao antes do Spec Doc
4. Gere um arquivo docs/PRD-filtro-periodo.md consolidando o resultado da discovery
```

## Ex 2 - Spec Doc

```text
Baseado no PRD-filtro-periodo.md que acabamos de gerar, crie o arquivo docs/specs/SPEC-filtro-periodo.md para a feature de filtro de periodo no dashboard piggbank.

Antes de gerar o Spec Doc:
1. Faca research no repositorio para identificar o que ja existe e pode ser aproveitado (tipos, utilitarios, componentes)
2. Use o template templates/spec-doc.md e o contexto ja disponivel no CLAUDE.md do projeto
```

## Ex 3 - Implementation

### Passo 1

```text
Faz um filtro de data pra mim
```

### Passo 2

```text
Implementa o componente DateRangeFilter para o projeto piggbank.

Leia os documentos ja criados no repositorio:
- docs/specs/SPEC-filtro-periodo.md - criterios de aceite, escopo e notas tecnicas
- docs/PRD-filtro-periodo.md - contexto e requisitos da feature
- CLAUDE.md - padroes e stack do projeto
```

## Ex 4 - Code Review

### Passo 1

```text
Revisa as mudancas nao comitadas e gera o arquivo docs/review-vibe.md com o resultado.
```

### Passo 2

```text
Revisa as mudancas nao comitadas contra o Spec Doc e as regras abaixo.

Leia antes de revisar:
- docs/specs/SPEC-filtro-periodo.md - criterios de aceite e escopo
- CLAUDE.md - padroes e stack do projeto

Aplique estas regras de review por categoria:

## Spec Compliance
- Feature fora do scope do Spec Doc -> CRITICO
- Goal do Spec Doc nao atendido por codigo -> CRITICO
- Comportamento de erro diferente do especificado -> ALTO
- Edge cases documentados sem teste -> MEDIO

## Architecture
- Violacao de separacao de camadas -> CRITICO
- Service que conhece HTTP (importa Request/Response) -> ALTO
- Entidade de dominio exposta direto na API sem DTO -> ALTO
- Inconsistencia de padrao entre modulos -> MEDIO

## Code Quality
- Funcao com responsabilidade multipla (SRP) -> CRITICO
- Codigo duplicado substancial (>20 linhas) -> CRITICO
- Nomes enganosos ou magic numbers -> ALTO
- Funcao >50 linhas ou >4 niveis de nesting -> ALTO

## Performance
- Query N+1 -> CRITICO
- Ausencia de paginacao em lista ilimitada -> CRITICO
- Overfetching (SELECT * quando so precisa de 2 campos) -> MEDIO
- Re-renderizacao excessiva sem memo -> MEDIO

## Security & LGPD
- Secrets ou tokens hardcoded -> CRITICO
- Dados pessoais em logs -> CRITICO
- SQL injection (concatenacao de input) -> CRITICO
- Falta de rate limiting em endpoints publicos -> ALTO

## Test Coverage
- Codigo de negocio sem nenhum teste -> CRITICO
- Testes so com happy path (sem casos de erro) -> ALTO
- Nomes genericos em testes -> ALTO
- Edge cases obvios sem teste (null, lista vazia) -> MEDIO

Gera o arquivo docs/review-spec.md com o resultado: issues agrupados por categoria, com severidade e sugestao de fix.
```
