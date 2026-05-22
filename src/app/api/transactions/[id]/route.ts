import { NextResponse, NextRequest } from "next/server";
import { deleteTransaction, updateTransaction } from "@/lib/api";

export async function DELETE(
  _request: NextRequest,
  context: { params: any },
) {
  const params = await Promise.resolve(context.params);
  const { id } = params;
  await deleteTransaction(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  context: { params: any },
) {
  const params = await Promise.resolve(context.params);
  const { id } = params;
  const body = await request.json();
  const updated = await updateTransaction(id, body);
  if (!updated) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, transaction: updated });
}
