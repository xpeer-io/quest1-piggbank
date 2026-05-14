import { NextResponse } from "next/server";
import { mockTransactions } from "@/data/mock";
import type { Transaction } from "@/types";

export async function GET() {
  return NextResponse.json(
    mockTransactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString(),
    })),
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !body ||
    typeof body.id !== "string" ||
    typeof body.description !== "string" ||
    typeof body.amount !== "number" ||
    (body.type !== "income" && body.type !== "expense") ||
    typeof body.date !== "string" ||
    typeof body.category !== "string"
  ) {
    return new NextResponse("Invalid transaction payload", { status: 400 });
  }

  const transaction: Transaction = {
    ...body,
    date: new Date(body.date),
  };

  mockTransactions.unshift(transaction);

  return NextResponse.json(transaction, { status: 201 });
}
