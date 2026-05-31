# Cenários de Teste: Exportação de Transações em CSV

## 📌 Contexto
A funcionalidade permite exportar as transações exibidas no dashboard em formato CSV, respeitando filtros aplicados.

---

## ✅ Cenário 1: Exportação Bem-Sucedida

- Dado que existem transações carregadas no dashboard
- Quando o usuário clica em "Exportar CSV"
- Então deve ser gerado um arquivo CSV com todas as transações visíveis
- E o download deve iniciar automaticamente

---

## 📄 Cenário 2: Formato do CSV

- O arquivo deve conter as colunas:
  - Data
  - Tipo (Entrada/Saída)
  - Valor
  - Categoria

- Regras de formatação:
  - Data no formato YYYY-MM-DD
  - Separador de colunas: vírgula (,)
  - Encoding UTF-8

---

## 📂 Cenário 3: Nome do Arquivo

- O download deve ser iniciado automaticamente com o nome:

```
transacoes-piggbank-YYYYMMDD.csv
```

---

## ⚠️ Cenário 4: Sem Transações

- Dado que não existem transações no dashboard
- Quando o usuário clica em "Exportar CSV"
- Então o sistema deve:
  - Gerar um CSV apenas com cabeçalho OU
  - Exibir mensagem informando ausência de dados

---

## 💥 Cenário 5: Caracteres Especiais (Edge Case)

- Dado transações com:
  - acentos
  - símbolos ($, %, &, etc)
  - textos longos

- Quando exportado
- Então o CSV deve manter os dados íntegros sem corromper encoding

---

## 📅 Cenário 6: Datas em Diferentes Formatos

- Dado transações armazenadas como Date objects
- Quando exportadas
- Então todas as datas devem ser normalizadas para YYYY-MM-DD

---

## 🔒 Cenário 7: Não Impacto no Sistema

- A exportação NÃO deve:
  - Alterar métricas
  - Alterar lista de transações
  - Alterar estado global do dashboard