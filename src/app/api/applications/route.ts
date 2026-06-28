import { NextResponse } from "next/server";
import { insertApplication } from "@/lib/db";
import { applicationSchema, getApplicationFieldErrors } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Не удалось прочитать тело запроса" },
      { status: 400 }
    );
  }

  const result = applicationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { status: "invalid", errors: getApplicationFieldErrors(result.error) },
      { status: 400 }
    );
  }

  try {
    await insertApplication(result.data);
  } catch {
    return NextResponse.json(
      { status: "error", message: "Ошибка при сохранении заявки" },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "saved", message: "Заявка принята" });
}
