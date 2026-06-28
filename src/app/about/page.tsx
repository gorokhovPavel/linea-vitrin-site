import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center h-14">
          <Link href="/" className="font-bold text-lg tracking-tight">
            Vibe Venture
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          ← Назад
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-10">О Vibe Venture</h1>

        {/* Mission */}
        <section className="mb-10">
          <div className="w-8 h-1 bg-amber-400 rounded-full mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Наша миссия</h2>
          <p className="text-gray-600 leading-relaxed">
            Мы помогаем ИИ-командам пройти самый трудный первый шаг. Большинство сильных идей
            гибнут не из-за плохого продукта, а из-за отсутствия ресурсов, правильных связей и
            структурированной экспертизы в самом начале пути. Vibe Venture закрывает именно этот
            разрыв.
          </p>
        </section>

        {/* Investment thesis */}
        <section className="mb-10">
          <div className="w-8 h-1 bg-amber-400 rounded-full mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Инвестиционный тезис</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Мы фокусируемся на ранних ИИ-стартапах с конкретной проблемой. Нам не важна вертикаль —
            важен фаундер с пониманием аудитории и способностью к быстрой итерации.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              Стадии: идея, прототип, MVP, ранняя выручка
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              B2B и B2C, без ограничений по отрасли
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              Команды от 1 до 5 человек
            </li>
          </ul>
        </section>

        {/* What we offer */}
        <section className="mb-10">
          <div className="w-8 h-1 bg-amber-400 rounded-full mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Что мы предлагаем</h2>
          <div className="space-y-5">
            {[
              {
                title: "Микрогрант до $10K",
                desc: "Финансирование без размытия доли на ранней стадии. Деньги на прототип, первые интервью с пользователями или найм первого разработчика.",
              },
              {
                title: "Продуктовая обратная связь",
                desc: "Структурированные сессии с практиками рынка. Помогаем правильно сформулировать ценностное предложение и приоритизировать фичи до питча.",
              },
              {
                title: "Упаковка питча",
                desc: "Работаем над deck и нарративом вместе с командой. После сессий у вас есть история, которую понимают инвесторы следующего раунда.",
              },
              {
                title: "Пилотные интро",
                desc: "Знакомим с потенциальными первыми клиентами из нашей сети. Живые интро, а не холодные письма — ранняя валидация с реальными пользователями.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-gray-200 hover:border-amber-300 transition-colors"
              >
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How we work */}
        <section className="mb-12">
          <div className="w-8 h-1 bg-amber-400 rounded-full mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Как мы работаем</h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "Заявка", desc: "Заполняете форму на сайте — это занимает 5 минут." },
              { step: "2", title: "Первичный звонок", desc: "Если заявка проходит отбор, назначаем 30-минутный звонок в течение 2 недель." },
              { step: "3", title: "Экспертная сессия", desc: "Глубокий разбор продукта, рынка и команды с нашими партнёрами." },
              { step: "4", title: "Решение", desc: "Даём конкретный ответ: входим или нет, и почему." },
              { step: "5", title: "Поддержка", desc: "После входа — регулярные встречи, доступ к сети и ресурсам." },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </span>
                <div>
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  <span className="text-gray-600"> — {item.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Готовы рассказать о своём проекте?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Подайте заявку — первичный ответ в течение 2 недель.
          </p>
          <Link
            href="/#form"
            className="inline-block px-8 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-full transition-colors"
          >
            Подать заявку
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Vibe Venture. Все права защищены.
      </footer>
    </div>
  );
}
