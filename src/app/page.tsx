"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { getLeadFieldErrors, leadSchema } from "@/lib/validation";

type FormValues = {
  contactPerson: string;
  contactPhone: string;
  rewardExpectation: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = { contactPerson: "", contactPhone: "", rewardExpectation: "" };

const grounds = [
  { title: "Конфиденциально", description: "Данные не публикуются и доступны только команде проверки." },
  { title: "Без лишних вопросов", description: "На первом шаге не нужно объяснять историю или прикладывать документы." },
  { title: "Открыты к вознаграждению", description: "Если наводка подтвердится, мы обсудим благодарность отдельно." },
  { title: "Человеческий контакт", description: "С вами свяжется куратор галереи, а не автоматическая система." },
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function validate(values: FormValues): FormErrors {
  const result = leadSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const fieldErrors = getLeadFieldErrors(result.error);

  return {
    contactPerson: fieldErrors.contactPerson?.[0],
    contactPhone: fieldErrors.contactPhone?.[0],
    rewardExpectation: fieldErrors.rewardExpectation?.[0],
  };
}

function extractServerErrorMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const typed = data as { errors?: Record<string, string[]>; message?: string };
    const messages = typed.errors ? Object.values(typed.errors).flat() : [];

    if (messages.length > 0) {
      return messages.join(" ");
    }

    if (typed.message) {
      return typed.message;
    }
  }

  return "Не удалось отправить обращение. Попробуйте ещё раз.";
}

export default function Home() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStatus("idle");
    setServerError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setServerError(extractServerErrorMessage(data));
        return;
      }

      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
      setServerError("Не удалось отправить обращение. Проверьте соединение и попробуйте ещё раз.");
    }
  }

  return (
    <>
      <nav className="nav">
        <a href="#case">Витрина дела</a>
        <a href="#grounds">Основания для контакта</a>
        <a href="#request">Первичный запрос</a>
      </nav>

      <main>
        <section id="case" className="section hero">
          <h1>Галерея уточняет происхождение одной из работ</h1>
          <p>
            Мы собираем точные сведения о прежних владельцах одной из работ в коллекции.
            Если вам что-то известно — оставьте контакт, дальше мы во всём разберёмся сами,
            без публичных подробностей.
          </p>
          <a className="cta" href="#request">Оставить наводку</a>
        </section>

        <section id="grounds" className="section benefits">
          <h2>Почему можно оставить контакт</h2>
          <div className="cards">
            {grounds.map((ground) => (
              <article className="card" key={ground.title}>
                <h3>{ground.title}</h3>
                <p>{ground.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="request" className="section form-section">
          <h2>Первичный запрос</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="contactPerson">Контактное лицо</label>
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                value={values.contactPerson}
                onChange={handleChange}
              />
              {errors.contactPerson && <p className="error">{errors.contactPerson}</p>}
            </div>

            <div className="field">
              <label htmlFor="contactPhone">Телефон для связи</label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="text"
                value={values.contactPhone}
                onChange={handleChange}
              />
              {errors.contactPhone && <p className="error">{errors.contactPhone}</p>}
            </div>

            <div className="field">
              <label htmlFor="rewardExpectation">Вознаграждение за наводку</label>
              <input
                id="rewardExpectation"
                name="rewardExpectation"
                type="text"
                placeholder="Сумма, диапазон или «обсудить после проверки»"
                value={values.rewardExpectation}
                onChange={handleChange}
              />
              {errors.rewardExpectation && <p className="error">{errors.rewardExpectation}</p>}
            </div>

            <button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Отправка..." : "Отправить"}
            </button>

            {status === "success" && (
              <p className="success">Обращение принято. Мы свяжемся с вами для проверки наводки.</p>
            )}
            {status === "error" && serverError && <p className="error">{serverError}</p>}
          </form>
        </section>
      </main>
    </>
  );
}
