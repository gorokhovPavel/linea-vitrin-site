import { z } from "zod";

function isPhoneLike(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[+\d][\d\s\-()]*$/.test(value);
}

export const leadSchema = z.object({
  contactPerson: z
    .string({ message: "Укажите контактное лицо" })
    .trim()
    .min(2, "Контактное лицо должно содержать минимум 2 символа")
    .max(80, "Контактное лицо должно содержать не более 80 символов"),
  contactPhone: z
    .string({ message: "Укажите телефон для связи" })
    .trim()
    .min(6, "Телефон должен содержать минимум 6 символов")
    .max(32, "Телефон должен содержать не более 32 символов")
    .refine(isPhoneLike, "Введите телефон в виде номера, например +7 800 555-35-35"),
  rewardExpectation: z
    .string({ message: "Укажите ожидание по вознаграждению" })
    .trim()
    .min(2, "Опишите ожидание по вознаграждению: сумма, диапазон или «обсудить после проверки»")
    .max(200, "Ожидание по вознаграждению должно содержать не более 200 символов"),
});

export type LeadFieldErrors = Partial<Record<keyof z.infer<typeof leadSchema>, string[]>>;

export function getLeadFieldErrors(error: z.ZodError): LeadFieldErrors {
  return z.flattenError(error).fieldErrors;
}
