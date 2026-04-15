# Desafio: Implementação do Filtro de Período no Piggbank

## 📝 Descrição da Atividade

O projeto **piggbank** é um dashboard financeiro para PMEs que exibe métricas de faturamento, despesas e fluxo de caixa. Atualmente, a aplicação possui um **filtro de período que ainda não funciona**. Nesta atividade, você irá trabalhar na implementação e correção dessa funcionalidade com o auxílio de IA.

## 🎯 Objetivos

Ao final desta atividade, você será capaz de:

- Praticar os fundamentos de **Vibe Coding** na rotina de desenvolvimento.
- Entender na prática a importância de ter **requisitos** claros e bem definidos.
- Compreender e aplicar o conceito de **Spec-Driven Development** (Desenvolvimento Guiado por Especificações).

## ⚠️ Regras e Restrições

- **Proibido usar o PLAN:** O aluno **não deve** utilizar a funcionalidade de "PLAN" (Plano) do GitHub Copilot Edits/Chat durante a jornada. O foco é praticar o direcionamento passo a passo.

---

## 🚀 Passo a Passo da Atividade

### 1. Navegação no Terminal

Abra o seu Terminal do Windows (Prompt de Comando, PowerShell) ou o Git Bash. Você deverá criar uma pasta para seus projetos e navegar até ela usando os comandos básicos do sistema:

- Utilize `dir` para listar os diretórios (pastas e arquivos) disponíveis de onde você está.
- Utilize `cd nome-da-pasta` para navegar para dentro de um diretório.
- Se precisar voltar um diretório anterior, utilize `cd ..`

### 2. Clonando o Repositório

Após navegar até a pasta desejada no seu terminal, realize o clone do repositório da atividade:

```bash
git clone git@github.com:xpeer-io/quest1-piggbank.git
```

### 3. Abertura no VS Code, Instalação e Execução

Acesse o diretório do projeto recém-clonado e abra-o no VS Code usando o comando `code .` no terminal. Em seguida, utilize o terminal integrado do VS Code (`ctrl + j`) para instalar as dependências e iniciar a aplicação conforme o README.md:

```bash
cd quest1-piggbank
code .
npm install
npm run dev
```

### 4. Mão na Massa: Exercícios de Prompts

Acesse os arquivos contidos na pasta prompts. Lá você encontrará a sequência de exercícios que deve ser seguida.

- Vá resolvendo cada um dos exercícios (arquivos `.md`) em ordem crescente.
- **Relatório de progresso:** Em cada exercício, você deverá escrever **detalhadamente** os resultados que a IA gerou e a sua avaliação sobre as respostas.

### 5. Análise Técnica e Qualidade

Durante a realização de cada exercício, você **deve** realizar e relatar a seguinte análise crítica sobre o código produzido pela IA:

1. **Build:** A aplicação fez build com sucesso após a implementação? (Teste rodando `npm run build`).
2. **Testes e IA:** A IA criou arquivos de testes automatizados ativamente junto com o código da funcionalidade, ou os ignorou?
3. **Sucesso dos Testes:** Os testes passaram com sucesso após cada iteração e nova implementação? (Verifique executando `npm test`).
4. **Cobertura (Coverage):** Como ficou a métrica de cobertura de testes da aplicação no final do seu desenvolvimento? (Verifique executando `npm test -- --coverage`).

### 6. Entrega

A entrega da atividade devera ser realizada da seguinte forma:

- Transformar o relatorio final em PDF
- Acessar o link da atividade no Blackboard
- Realizar o upload do arquivo ate o prazo final estipulado
