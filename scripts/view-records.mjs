import path from "node:path";
import sqlite3 from "sqlite3";
import { existsSync } from "node:fs";

const DB_PATH = path.join(process.cwd(), "data", "applications.db");

if (!existsSync(DB_PATH)) {
  console.log("База данных не найдена. Отправьте хотя бы одну заявку через форму.");
  process.exit(0);
}

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Не удалось открыть базу данных:", err.message);
    process.exit(1);
  }
});

db.all(
  "SELECT id, founder_name, contact, project_name, project_stage FROM applications ORDER BY id",
  [],
  (err, rows) => {
    if (err) {
      console.error("Ошибка при чтении:", err.message);
      db.close();
      process.exit(1);
    }

    if (!rows || rows.length === 0) {
      console.log("Заявок пока нет.");
    } else {
      console.log(`Всего заявок: ${rows.length}\n`);
      for (const row of rows) {
        console.log(
          `${row.id}. ${row.founder_name} — ${row.contact} — ${row.project_name} (${row.project_stage})`
        );
      }
    }

    db.close();
  }
);
