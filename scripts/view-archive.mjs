import path from "node:path";
import sqlite3 from "sqlite3";

const DB_PATH = path.join(process.cwd(), "data", "archive.db");

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (openError) => {
  if (openError) {
    console.error(`Не удалось открыть архив: ${DB_PATH}`);
    console.error(openError.message);
    process.exit(1);
  }
});

db.all(
  "SELECT contact_person, contact_phone, reward_expectation FROM leads ORDER BY id",
  [],
  (error, rows) => {
    if (error) {
      console.error(error.message);
      db.close();
      process.exit(1);
    }

    if (rows.length === 0) {
      console.log("Наводок в архиве пока нет.");
    } else {
      for (const row of rows) {
        console.log(`${row.contact_person} — ${row.contact_phone} — ${row.reward_expectation}`);
      }
    }

    db.close();
  },
);
