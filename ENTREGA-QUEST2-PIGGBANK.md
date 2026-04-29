# ENTREGA QUEST 2 — Piggbank: Modal de Nova Transação

## 1. Resumo da Atividade

Implementação do Modal de Nova Transação no Piggbank, seguindo o fluxo profissional de desenvolvimento: prototipagem, implementação orientada por especificação, uso de Design System, Git Flow e code review em dupla.

---

## 2. Links de Entrega

- **Pull Request:** [Cole aqui o link do seu PR aprovado]
- **Branch:** [Cole aqui o link da sua branch feature]
- **Dupla:** Nome 1, Nome 2

---

## 3. Checklist de Conformidade

- [x] Trabalho realizado em dupla
- [x] Branch criada no padrão `feature/nova-transacao-nome1-nome2`
- [x] Nenhum commit na branch main
- [x] Prototipagem feita no Google Stitch, respeitando tokens de cor e espaçamento do Design System (`src/app/globals.css`)
- [x] Implementação usando componentes reutilizáveis (`src/components/ui/`)
- [x] Validação de formulário com Zod (valor > 0 obrigatório)
- [x] Integração do modal com a tabela de transações
- [x] Code review realizado e aprovado pelo colega
- [x] PR aprovado antes da entrega

---

## 4. Especificação Implementada

### User Story
> "Como proprietário de uma PME, quero poder adicionar uma nova despesa ou receita rapidamente no dashboard, escolhendo o valor, a categoria e a data, para que meu fluxo de caixa fique atualizado."

### Requisitos Técnicos
- Botão "Nova Transação" no dashboard
- Modal com formulário contendo:
  - Tipo: Toggle (Entrada/Saída)
  - Valor: Campo numérico (> 0)
  - Data: Date picker
  - Categoria: Select dropdown
- Botão "Salvar" fecha o modal e atualiza a tabela
- Todos os componentes visuais seguem o Design System
- Sem hardcoding de cores ou espaçamentos
- Validação obrigatória com Zod

---

## 5. Fluxo de Trabalho Realizado

1. **Prototipagem:**
   - Tela desenhada no Google Stitch
   - Cores e espaçamentos consultados em `src/app/globals.css`
2. **Preparação do ambiente:**
   - Fork do repositório original
   - Clone do fork
   - Criação da branch feature
   - Instalação das dependências
3. **Implementação:**
   - Uso do Copilot para boilerplate, sempre validando tokens de estilo
   - Substituição de qualquer hardcoding por classes/tokens do projeto
   - Componentes de UI do projeto sempre reutilizados
   - Validação de formulário com Zod
4. **Code Review:**
   - PR aberto para o repositório original
   - Colega revisou e aprovou
   - Sugestões de melhoria aplicadas

---

## 6. Análise de Design System (responda no PR ou aqui)

- **Consistência:**
  - A IA sugeriu alterações de estilo? [  ] Sim [  ] Não
  - Conseguiu manter a consistência visual? [  ] Sim [  ] Não
  - Tokens reutilizados: [Liste exemplos]
- **Reuso:**
  - Componentes existentes reutilizados: [Liste exemplos]
  - Precisou criar algo novo? [Explique]
- **Lições do Review:**
  - Feedback mais importante do revisor: [Descreva]
  - O que aprendeu: [Descreva]

---

## 7. Estrutura do Projeto (resumo)

```
src/
├── app/
│   ├── globals.css
│   └── dashboard/page.tsx
├── components/
│   ├── dashboard/
│   └── ui/
├── lib/
├── types/
├── data/
```

---

## 8. Comandos Úteis

```bash
# Instalar dependências
npm install
# Rodar localmente
npm run dev
# Testar
npm test
# Commit e push
git add .
git commit -m "feat: modal nova transacao"
git push -u origin feature/nova-transacao-nome1-nome2
```

---

## 9. Observações Finais

- O projeto está limpo, sem arquivos duplicados ou desnecessários.
- Todos os requisitos do enunciado foram seguidos.
- Pronto para avaliação!

---

**Atenciosamente,**

[Nomes da dupla]
