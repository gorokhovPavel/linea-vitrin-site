import { z } from "zod";

export const applicationSchema = z.object({
  founderName: z
    .string({ message: "Укажите имя основателя" })
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя должно содержать не более 100 символов"),
  contact: z
    .string({ message: "Укажите контакт" })
    .trim()
    .min(2, "Контакт должен содержать минимум 2 символа")
    .max(200, "Контакт должен содержать не более 200 символов"),
  projectName: z
    .string({ message: "Укажите название проекта" })
    .trim()
    .min(2, "Название должно содержать минимум 2 символа")
    .max(100, "Название должно содержать не более 100 символов"),
  projectStage: z.enum(["idea", "prototype", "mvp", "early_revenue"], {
    message: "Выберите стадию проекта",
  }),
  problemDescription: z
    .string({ message: "Опишите проблему" })
    .trim()
    .min(10, "Описание должно содержать минимум 10 символов")
    .max(1000, "Описание должно содержать не более 1000 символов"),
  demoLink: z
    .string()
    .trim()
    .optional()
    .transform((val) => val ?? "")
    .pipe(
      z
        .string()
        .max(500)
        .refine(
          (val) => val === "" || /^https?:\/\/.+/.test(val),
          "Введите корректный URL (начинается с http:// или https://)"
        )
    ),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export type ApplicationFieldErrors = Partial<
  Record<keyof ApplicationData, string[]>
>;

export function getApplicationFieldErrors(
  error: z.ZodError
): ApplicationFieldErrors {
  return z.flattenError(error).fieldErrors as ApplicationFieldErrors;
}
