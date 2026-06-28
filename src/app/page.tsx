"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  applicationSchema,
  getApplicationFieldErrors,
  type ApplicationData,
  type ApplicationFieldErrors,
} from "@/lib/validation";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const PROJECT_STAGES = [
  { value: "idea", label: "Идея" },
  { value: "prototype", label: "Прототип" },
  { value: "mvp", label: "MVP" },
  { value: "early_revenue", label: "Ранняя выручка" },
] as const;

const FAQ_ITEMS = [
  {
    q: "На какой стадии вы работаете?",
    a: "Мы работаем с командами от идеи до ранней выручки. Главное — наличие конкретной проблемы и понимание аудитории.",
  },
  {
    q: "Что вы берёте взамен?",
    a: "Конвертируемый займ или SAFE с условиями, которые обсуждаются индивидуально. Мы не требуем долю на старте.",
  },
  {
    q: "Сколько длится рассмотрение?",
    a: "Первичный ответ — в течение 2 недель после получения заявки.",
  },
  {
    q: "Какой ИИ-проект вам интересен?",
    a: "Любой проект с конкретной проблемой и понятной целевой аудиторией: B2B, B2C, любая вертикаль.",
  },
  {
    q: "Как проходит первичный отбор?",
    a: "Заявка → первичный звонок с командой → решение. Весь процесс занимает не более 3 недель.",
  },
];

const BENEFITS = [
  {
    title: "Микрогрант",
    description: "До $10K без размытия доли на первый шаг — прототип, исследование или первые продажи.",
  },
  {
    title: "Продуктовая обратная связь",
    description: "Сессии с практиками рынка, которые помогут отточить продукт до питча инвесторам.",
  },
  {
    title: "Упаковка питча",
    description: "Deck и нарратив для следующего раунда. Рассказываем историю проекта языком инвесторов.",
  },
  {
    title: "Пилотные интро",
    description: "Знакомства с первыми потенциальными клиентами из нашей сети для ранней валидации.",
  },
];

const emptyForm: ApplicationData = {
  founderName: "",
  contact: "",
  projectName: "",
  projectStage: "idea",
  problemDescription: "",
  demoLink: "",
};

function extractServerErrors(data: unknown): ApplicationFieldErrors & { _global?: string } {
  if (data && typeof data === "object") {
    const d = data as { errors?: ApplicationFieldErrors; message?: string };
    if (d.errors) return d.errors;
    if (d.message) return { _global: d.message } as ApplicationFieldErrors & { _global: string };
  }
  return {};
}

export default function Home() {
  const [values, setValues] = useState<ApplicationData>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<ApplicationFieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError(null);
    if (status !== "idle") setStatus("idle");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = applicationSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(getApplicationFieldErrors(parsed.error));
      return;
    }

    setStatus("submitting");
    setFieldErrors({});
    setServerError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errs = extractServerErrors(data);
        const { _global, ...fieldErrs } = errs as ApplicationFieldErrors & { _global?: string };
        if (Object.keys(fieldErrs).length) setFieldErrors(fieldErrs);
        setServerError(_global ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(emptyForm);
    } catch {
      setServerError("Ошибка сети. Проверьте соединение и попробуйте снова.");
      setStatus("error");
    }
  }

  return (
    <>
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <span className="font-bold text-lg tracking-tight">Vibe Venture</span>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-gray-900 transition-colors">О нас</a>
            <a href="#benefits" className="hover:text-gray-900 transition-colors">Плюсы</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">Вопросы</a>
            <a
              href="#form"
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-full transition-colors"
            >
              Подать заявку
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block mb-4 text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Ранние ИИ-стартапы
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Инвестиции и экспертиза для ранних ИИ-стартапов
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Vibe Venture помогает командам с конкретной проблемой пройти самый трудный первый шаг —
            от идеи до первых клиентов.
          </p>
          <a
            href="#form"
            className="inline-block px-8 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-full text-base transition-colors"
          >
            Подать заявку
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Кому мы помогаем</h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Мы работаем с ранними ИИ-командами: основателями с идеей, прототипом или первым MVP.
            Нам важно одно — понятная проблема и конкретная аудитория. Вертикаль и бизнес-модель
            вторичны.
          </p>
          <ul className="space-y-2 text-gray-700 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              ИИ-стартапы на стадии идеи, прототипа или MVP
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              Команды с конкретной формулировкой проблемы
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              Проекты с понятной целевой аудиторией — B2B или B2C
            </li>
          </ul>
          <Link
            href="/about"
            className="inline-block px-6 py-2.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors"
          >
            Подробнее о компании →
          </Link>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Что вы получаете</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-1 bg-amber-400 mb-4 rounded-full" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Часто задаваемые вопросы</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <span className="text-amber-500 text-xl ml-4 flex-shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-3">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="form" className="bg-white py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Заявка на первичный отбор</h2>
          <p className="text-gray-600 mb-8">
            Расскажите о проекте — мы ответим в течение 2 недель.
          </p>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="text-3xl mb-3">✓</div>
              <p className="text-green-800 font-semibold text-lg">Заявка принята!</p>
              <p className="text-green-700 text-sm mt-2">
                Мы рассмотрим её и свяжемся с вами в течение 2 недель.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm text-green-700 underline hover:no-underline"
              >
                Подать ещё одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Field label="Имя основателя" error={fieldErrors.founderName?.[0]}>
                <input
                  id="founderName"
                  name="founderName"
                  type="text"
                  value={values.founderName}
                  onChange={handleChange}
                  placeholder="Иван Петров"
                  className={inputCls(!!fieldErrors.founderName)}
                />
              </Field>

              <Field label="Email или Telegram" error={fieldErrors.contact?.[0]}>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={values.contact}
                  onChange={handleChange}
                  placeholder="ivan@example.com или @ivanpetrov"
                  className={inputCls(!!fieldErrors.contact)}
                />
              </Field>

              <Field label="Название проекта" error={fieldErrors.projectName?.[0]}>
                <input
                  id="projectName"
                  name="projectName"
                  type="text"
                  value={values.projectName}
                  onChange={handleChange}
                  placeholder="DataSense AI"
                  className={inputCls(!!fieldErrors.projectName)}
                />
              </Field>

              <Field label="Стадия проекта" error={fieldErrors.projectStage?.[0]}>
                <select
                  id="projectStage"
                  name="projectStage"
                  value={values.projectStage}
                  onChange={handleChange}
                  className={inputCls(!!fieldErrors.projectStage)}
                >
                  {PROJECT_STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Описание проблемы" error={fieldErrors.problemDescription?.[0]}>
                <textarea
                  id="problemDescription"
                  name="problemDescription"
                  value={values.problemDescription}
                  onChange={handleChange}
                  placeholder="Какую проблему решаете? Кто ваша аудитория?"
                  rows={4}
                  className={inputCls(!!fieldErrors.problemDescription)}
                />
              </Field>

              <Field
                label="Ссылка на демо или репозиторий"
                hint="Необязательно"
                error={fieldErrors.demoLink?.[0]}
              >
                <input
                  id="demoLink"
                  name="demoLink"
                  type="text"
                  value={values.demoLink ?? ""}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className={inputCls(!!fieldErrors.demoLink)}
                />
              </Field>

              {serverError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-gray-900 font-bold rounded-full transition-colors text-base"
              >
                {status === "submitting" ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-8 px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Vibe Venture. Все права защищены.
      </footer>
    </>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full px-4 py-2.5 rounded-lg border text-sm transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-amber-300",
    hasError
      ? "border-red-400 bg-red-50"
      : "border-gray-300 bg-white hover:border-gray-400",
  ].join(" ");
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
