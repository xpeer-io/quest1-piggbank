# Cenários de Teste: Exportação de Transações em CSV

## Cenários Positivos

### Cenário 1: Exportação Bem-Sucedida com Dados Padrão
- **Dado**: Dashboard contém 5 transações de renda e despesa com datas variadas
- **Quando**: Usuário clica no botão "Exportar CSV"
- **Então**: 
  - Arquivo é gerado com nome padrão `transacoes_YYYYMMDD_HHMMSS.csv`
  - Download é iniciado automaticamente
  - Arquivo contém cabeçalhos: `ID,Data,Tipo,Descrição,Categoria,Valor`
  - Todas as 5 transações aparecem com dados corretos
  - Formato de moeda está correto (R$ sem símbolo no CSV)

### Cenário 2: Exportação com Filtro de Data Aplicado
- **Dado**: Dashboard com transações do último mês selecionadas
- **Quando**: Usuário clica em "Exportar CSV" com filtro ativo
- **Então**:
  - Apenas transações do período filtrado são incluídas no CSV
  - Nome do arquivo reflete intervalo: `transacoes_2026-04-01_a_2026-05-15.csv`
  - Total de linhas corresponde ao número de transações filtradas

### Cenário 3: Exportação com Múltiplas Categorias
- **Dado**: Dashboard mostra transações de categorias diversas (Vendas, Infraestrutura, Serviços, Software)
- **Quando**: Usuário clica em "Exportar CSV"
- **Então**:
  - Todas as categorias são preservadas corretamente
  - Separador de campos não interfere com nomes de categorias

### Cenário 4: Exportação com Valores em Diferentes Magnitudes
- **Dado**: Transações variam de R$ 1.50 até R$ 500.000,00
- **Quando**: Usuário clica em "Exportar CSV"
- **Então**:
  - Todos os valores são formatados como números decimais (2 casas)
  - Sem separador de milhar no CSV (compatível com Excel)
  - Valores negativos para despesas aparecem com `-` ou entre parênteses

### Cenário 5: Exportação com Descrições Longas
- **Dado**: Transações contêm descrições com até 200 caracteres
- **Quando**: Usuário clica em "Exportar CSV"
- **Então**:
  - Descrições completas aparecem sem truncamento
  - Quebras de linha em descrições são escapadas ou removidas

---

## Cenários Negativos

### Cenário 1: Nenhuma Transação Disponível
- **Dado**: Dashboard vazio (sem transações registradas)
- **Quando**: Usuário clica em "Exportar CSV"
- **Então**: 
  - **Opção A**: Arquivo com apenas cabeçalhos é gerado
  - **Opção B**: Modal exibe mensagem "Nenhuma transação para exportar"
  - Usuário é orientado a criar transações primeiro

### Cenário 2: Filtro Aplicado Resulta em Zero Transações
- **Dado**: Dashboard com transações, mas filtro de data não retorna resultados
- **Quando**: Usuário tenta exportar com filtro ativo
- **Então**:
  - Sistema detecta lista vazia
  - Exibe aviso: "Nenhuma transação corresponde ao filtro aplicado"
  - Botão "Exportar CSV" é desabilitado ou aviso é exibido

### Cenário 3: Erro ao Gerar Arquivo (Sem Espaço em Disco)
- **Dado**: Dispositivo sem espaço disponível
- **Quando**: Sistema tenta gerar e fazer download do arquivo
- **Então**:
  - Erro é capturado graciosamente
  - Modal exibe mensagem: "Erro ao gerar arquivo. Tente novamente."
  - Usuário pode tentar novamente

### Cenário 4: Erro de Permissão de Download
- **Dado**: Browser bloqueia downloads por política de segurança
- **Quando**: Sistema tenta iniciar download
- **Então**:
  - Erro é tratado
  - Usuário vê mensagem: "Verifique as permissões de download do seu navegador"

### Cenário 5: Timeout na Geração de Arquivo Grande
- **Dado**: Dashboard com 10.000+ transações
- **Quando**: Usuário clica em "Exportar CSV"
- **Então**:
  - Sistema mostra indicador de progresso
  - Se tempo exceder 30s: aviso "Processamento longo, aguarde..."
  - Fallback: usuário pode exportar em lotes (por mês/trimestre)

---

## Cenários de Edge Cases

### Cenário 1: Caracteres Especiais em Descrição
- **Dado**: Transação com descrição contendo: `"Café & Consultoria", R$100; €50`
- **Quando**: Usuário exporta CSV
- **Então**:
  - Caracteres são escapados corretamente (aspas duplas viram `""`)
  - Campo é envolvido por aspas: `"Café & Consultoria, R$100; €50"`
  - Arquivo abre corretamente em Excel/Sheets sem quebrar formatação

### Cenário 2: Caracteres de Quebra de Linha em Descrição
- **Dado**: Descrição contém quebra de linha acidental: `"Projeto\\nMultilinhas"`
- **Quando**: Usuário exporta CSV
- **Então**:
  - Quebra de linha é escapada (`\\n` removido ou convertido para espaço)
  - CSV permanece válido com uma linha por transação

### Cenário 3: Datas em Diferentes Formatos (Fuso Horário)
- **Dado**: Transações criadas em diferentes fusos horários (UTC, -3, +1)
- **Quando**: Usuário exporta CSV
- **Então**:
  - Todas as datas são normalizadas para formato padrão: `DD/MM/YYYY`
  - Fuso horário do servidor é usado consistentemente

### Cenário 4: Categoria com Acentuação
- **Dado**: Categorias: `Infraestrutura, Manutenção, São Paulo, Pré-venda`
- **Quando**: Usuário exporta CSV com codificação UTF-8
- **Então**:
  - Acentuação é preservada corretamente
  - Arquivo abre sem problemas em Excel (PT-BR)

### Cenário 5: Transação com Valor Zero
- **Dado**: Transação com valor R$ 0,00
- **Quando**: Usuário exporta CSV
- **Então**:
  - Valor aparece como `0.00` (não é omitido)
  - Tipo (entrada/saída) é preservado

### Cenário 6: Valores Muito Pequenos
- **Dado**: Transação de R$ 0,01
- **Quando**: Usuário exporta CSV
- **Então**:
  - Valor é exibido como `0.01`
  - Sem truncamento ou arredondamento

### Cenário 7: ID de Transação com Caracteres Especiais
- **Dado**: ID gerado como `txn_abc123-def_456`
- **Quando**: Usuário exporta CSV
- **Então**:
  - ID é preservado integralmente
  - Importação posterior consegue identificar transação única

### Cenário 8: Transações Duplicadas (ID Idêntico)
- **Dado**: Duas transações com mesmo ID acidental
- **Quando**: Usuário exporta CSV
- **Então**:
  - Sistema avisa sobre duplicação
  - Ambas são incluídas (com IDs diferenciados)
  - Ou apenas uma é exportada (com aviso)

### Cenário 9: Data Futura
- **Dado**: Transação com data posterior ao dia atual (ex: 2026-12-31)
- **Quando**: Usuário exporta CSV
- **Então**:
  - Data é exportada normalmente (sem validação de passado)
  - Funcionalidade permite planejamento futuro

### Cenário 10: Valores Negativos em Rendas
- **Dado**: Transação tipo "income" com valor `-1000`
- **Quando**: Usuário exporta CSV
- **Então**:
  - Valor é respeitado conforme stored (com sinal negativo)
  - Ou sistema corrige e converte para despesa
  - Comportamento é documentado

---

## Critérios de Aceitação Gerais

- [ ] Arquivo gerado segue padrão CSV RFC 4180
- [ ] Codificação é UTF-8 BOM (compatível com Excel)
- [ ] Nome do arquivo inclui timestamp para evitar conflitos
- [ ] Download funciona em Chrome, Firefox, Safari, Edge
- [ ] Arquivo importado de volta no sistema reconhece todas as transações
- [ ] Teste de volume: mínimo 1.000 transações processadas em < 5s
- [ ] Feedback visual durante processamento (spinner/progress bar)
- [ ] Testes automatizados cobrem 80%+ dos cenários

---

## Dados de Teste Sugeridos

### Transações Padrão
```csv
ID,Data,Tipo,Descrição,Categoria,Valor
1,01/04/2026,income,Assinatura cliente Acme Corp,Assinatura,12000.00
2,08/04/2026,expense,AWS — infraestrutura,Infraestrutura,2800.00
3,05/04/2026,expense,Consultoria design,Serviços,4500.00
4,03/04/2026,income,Assinatura cliente Beta Ltda,Assinatura,8500.00
5,28/03/2026,expense,Licença ferramentas dev,Software,1800.00
```

### Casos de Teste com Edge Cases
```csv
ID,Data,Tipo,Descrição,Categoria,Valor
6,15/05/2026,expense,"Café & Consultoria, R$100; €50",Alimentação,0.01
7,16/05/2026,income,Pré-venda — Projeto São Paulo,Pré-venda,500000.00
8,17/05/2026,expense,"Desenvolvimento - Múltiplas
Linhas",Infraestrutura,0.00
```
