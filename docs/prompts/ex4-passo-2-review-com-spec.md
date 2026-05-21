Revisar as mudanças não comitadas contra o Spec Doc e as regras abaixo.

Antes de revisar, leia:
- `docs/specs/SPEC-filtro-periodo.md` — critérios de aceite, escopo e notas técnicas
- `CLAUDE.md` — padrões de projeto e stack do piggbank

Use estas regras de revisão por categoria e liste os problemas encontrados:

## Spec Compliance
- Feature fora do scope do Spec Doc ? CRÍTICO
- Goal do Spec Doc não atendido por código ? CRÍTICO
- Comportamento de erro diferente do especificado ? ALTO
- Edge cases documentados sem teste ? MÉDIO

## Architecture
- Violação de separação de camadas ? CRÍTICO
- Service que conhece HTTP (importa Request/Response) ? ALTO
- Entidade de domínio exposta direto na API sem DTO ? ALTO
- Inconsistência de padrão entre módulos ? MÉDIO

## Code Quality
- Função com responsabilidade múltipla (SRP) ? CRÍTICO
- Código duplicado substancial (>20 linhas) ? CRÍTICO
- Nomes enganosos ou magic numbers ? ALTO
- Função >50 linhas ou >4 níveis de nesting ? ALTO

## Performance
- Query N+1 ? CRÍTICO
- Ausência de paginação em lista ilimitada ? CRÍTICO
- Overfetching (SELECT * quando só precisa de 2 campos) ? MÉDIO
- Re-renderização excessiva sem memo ? MÉDIO

## Security & LGPD
- Secrets ou tokens hardcoded ? CRÍTICO
- Dados pessoais em logs ? CRÍTICO
- SQL injection (concatenação de input) ? CRÍTICO
- Falta de rate limiting em endpoints públicos ? ALTO

## Test Coverage
- Código de negócio sem nenhum teste ? CRÍTICO
- Testes só com happy path (sem casos de erro) ? ALTO
- Nomes genéricos em testes ? ALTO
- Edge cases óbvios sem teste (null, lista vazia) ? MÉDIO

Gere o arquivo `docs/review-spec.md` com o resultado, agrupando as issues por categoria, incluindo severidade e sugestão de correção para cada item.
