import path from "node:path";
import fs from "node:fs";
import sqlite3 from "sqlite3";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "applications.db");
const CSV_PATH = path.join(DATA_DIR, "applications.csv");

const CSV_HEADER =
  "id,founder_name,contact,project_name,project_stage,problem_description,demo_link,created_at";

function escapeField(value) {
  const str = value == null ? "" : String(value);
  if (/[,"\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCsv(row) {
  return [
    row.id,
    row.founder_name,
    row.contact,
    row.project_name,
    row.project_stage,
    row.problem_description,
    row.demo_link,
    row.created_at,
  ]
    .map(escapeField)
    .join(",");
}

if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CSV_PATH, CSV_HEADER + "\n", "utf8");
  console.log("База данных не найдена. Создан CSV с заголовком.");
  console.log(`Файл: ${CSV_PATH}`);
  console.log("Записей: 0");
  process.exit(0);
}

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Не удалось открыть базу данных:", err.message);
    process.exit(1);
  }
});

db.all(
  "SELECT id, founder_name, contact, project_name, project_stage, problem_description, demo_link, created_at FROM applications ORDER BY id",
  [],
  (err, rows) => {
    if (err) {
      console.error("Ошибка при чтении:", err.message);
      db.close();
      process.exit(1);
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });

    const lines = [CSV_HEADER];
    if (rows && rows.length > 0) {
      for (const row of rows) {
        lines.push(rowToCsv(row));
      }
    }
    fs.writeFileSync(CSV_PATH, lines.join("\n") + "\n", "utf8");

    const count = rows ? rows.length : 0;
    console.log(`CSV сохранён: ${CSV_PATH}`);
    console.log(`Записей: ${count}`);

    db.close();
  }
);
