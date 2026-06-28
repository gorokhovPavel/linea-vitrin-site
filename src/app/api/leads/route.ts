import { NextResponse } from "next/server";
import { insertLead } from "@/lib/db";
import { getLeadFieldErrors, leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Не удалось прочитать обращение" },
      { status: 400 },
    );
  }

  const result = leadSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { status: "invalid", errors: getLeadFieldErrors(result.error) },
      { status: 400 },
    );
  }

  try {
    await insertLead(result.data);
  } catch {
    return NextResponse.json(
      { status: "error", message: "Техническая ошибка при сохранении наводки" },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "saved", message: "Наводка принята и сохранена в архиве" });
}
