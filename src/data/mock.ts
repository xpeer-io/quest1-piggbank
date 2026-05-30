import type { Transaction } from "@/types";

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000);

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Assinatura cliente Acme Corp",
    amount: 12000,
    type: "income",
    date: daysAgo(3),
    category: "Assinatura",
  },
  {
    id: "2",
    description: "AWS — infraestrutura",
    amount: 2800,
    type: "expense",
    date: daysAgo(5),
    category: "Infraestrutura",
  },
  {
    id: "3",
    description: "Consultoria design",
    amount: 4500,
    type: "expense",
    date: daysAgo(7),
    category: "Serviços",
  },
  {
    id: "4",
    description: "Assinatura cliente Beta Ltda",
    amount: 8500,
    type: "income",
    date: daysAgo(10),
    category: "Assinatura",
  },
  {
    id: "5",
    description: "Licença ferramentas dev",
    amount: 1800,
    type: "expense",
    date: daysAgo(12),
    category: "Software",
  },
  {
    id: "6",
    description: "Projeto pontual — Startup XYZ",
    amount: 18400,
    type: "income",
    date: daysAgo(15),
    category: "Projeto",
  },
  {
    id: "7",
    description: "Folha de pagamento — março",
    amount: 22400,
    type: "expense",
    date: daysAgo(18),
    category: "RH",
  },
  {
    id: "8",
    description: "Assinatura cliente Gama S.A.",
    amount: 9300,
    type: "income",
    date: daysAgo(22),
    category: "Assinatura",
  },
];
