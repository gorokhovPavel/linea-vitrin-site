# Vibe Venture

MVP-лендинг венчурной фирмы Vibe Venture для ранних ИИ-стартапов. Два экрана: основной лендинг и страница «О компании». Форма заявки на первичный отбор с клиентской и серверной валидацией, сохранением в SQLite и CSV-выгрузкой.

## Стек

| Технология | Версия | Роль |
|---|---|---|
| Next.js | 16 (App Router) | фреймворк, API-роуты |
| React | 19 | UI |
| TypeScript | 5 | типизация |
| Tailwind CSS | 4 | стили |
| Zod | 4 | схема валидации (клиент + сервер) |
| SQLite (`sqlite3`) | 6 | локальное хранение заявок |
| Node.js | — | скрипты выгрузки |

## Структура проекта

```
src/
  app/
    page.tsx                  — основной лендинг (hero, о нас, плюсы, FAQ, форма)
    about/
      page.tsx                — страница подробного описания компании
    api/
      applications/
        route.ts              — POST /api/applications (валидация + сохранение)
    layout.tsx                — корневой layout, метаданные
    globals.css               — подключение Tailwind
  lib/
    db.ts                     — SQLite: подключение, таблица, insertApplication
    validation.ts             — Zod-схема applicationSchema и хелперы
scripts/
  view-records.mjs            — просмотр заявок из SQLite в терминале
  export-csv.mjs              — выгрузка заявок в data/applications.csv
data/
  applications.db             — SQLite-база (создаётся автоматически, в git не попадает)
  applications.csv            — последняя CSV-выгрузка (создаётся скриптом)
```

## Запуск проекта

### macOS

```bash
git clone <url>
cd linea-vitrin-site
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Windows

```cmd
git clone <url>
cd linea-vitrin-site
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

> На Windows убедитесь, что установлены Node.js 18+ и Git. Скрипты используют стандартный Node.js — дополнительные инструменты не нужны.

## CSV-выгрузка

Скрипт читает заявки из `data/applications.db` и записывает их в `data/applications.csv`.

### macOS

```bash
npm run export-csv
```

### Windows

```cmd
npm run export-csv
```

Вывод в терминале покажет путь к файлу и количество записей. Если база пустая или отсутствует — создаётся CSV только с заголовком.

Просмотр заявок без CSV:

```bash
npm run records
```

## Поля формы

| Поле в интерфейсе | Ключ в коде | Обязательное | Правила |
|---|---|---|---|
| Имя основателя | `founderName` | да | 2–100 символов |
| Email или Telegram | `contact` | да | 2–200 символов |
| Название проекта | `projectName` | да | 2–100 символов |
| Стадия проекта | `projectStage` | да | `idea` / `prototype` / `mvp` / `early_revenue` |
| Описание проблемы | `problemDescription` | да | 10–1000 символов |
| Ссылка на демо или репозиторий | `demoLink` | нет | валидный URL или пусто |

Форма не принимает других полей — ни на клиенте, ни на сервере.

## API: `POST /api/applications`

**Запрос:**

```json
{
  "founderName": "Иван Петров",
  "contact": "ivan@example.com",
  "projectName": "DataSense AI",
  "projectStage": "mvp",
  "problemDescription": "Малый бизнес тратит часы на ручной анализ данных продаж.",
  "demoLink": "https://github.com/ivan/datasense"
}
```

**Ответы:**

- `200` — заявка принята и сохранена:
  ```json
  { "status": "saved", "message": "Заявка принята" }
  ```
- `400` — данные не прошли Zod-валидацию:
  ```json
  { "status": "invalid", "errors": { "contact": ["Контакт должен содержать минимум 2 символа"] } }
  ```
- `400` — некорректный JSON:
  ```json
  { "status": "error", "message": "Не удалось прочитать тело запроса" }
  ```
- `500` — ошибка сохранения в SQLite:
  ```json
  { "status": "error", "message": "Ошибка при сохранении заявки" }
  ```

## Команды

| Команда | Описание |
|---|---|
| `npm run dev` | Дев-сервер (Turbopack, http://localhost:3000) |
| `npm run build` | Продакшен-сборка |
| `npm run start` | Запуск собранного приложения |
| `npm run typecheck` | Проверка типов TypeScript без сборки |
| `npm run lint` | ESLint |
| `npm run records` | Вывести все заявки из SQLite в терминал |
| `npm run export-csv` | Выгрузить заявки в `data/applications.csv` |

## Устранение неполадок

**Порт 3000 занят.** `predev` автоматически завершает предыдущий dev-процесс. Если не помогло:

```bash
# macOS / Linux
pkill -f "next dev"
npm run dev

# Windows (PowerShell)
Stop-Process -Name "node" -Force
npm run dev
```

**Повреждённый кэш Turbopack** (`TurbopackInternalError` или `ENOENT build-manifest.json`):

```bash
# macOS / Linux
rm -rf .next && npm run dev

# Windows (PowerShell)
Remove-Item -Recurse -Force .next
npm run dev
```

**SQLite не открывается.** Убедитесь, что `data/applications.db` существует (появляется после первой отправки формы) и не заблокирован другим процессом.
