import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "archive.db");

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_person TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    reward_expectation TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

declare global {
  var __dbPromise: Promise<sqlite3.Database> | undefined;
}

function openDatabase(): Promise<sqlite3.Database> {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (openError) => {
      if (openError) {
        reject(openError);
        return;
      }

      db.run(CREATE_TABLE_SQL, (createError) => {
        if (createError) {
          reject(createError);
        } else {
          resolve(db);
        }
      });
    });
  });
}

function getDb(): Promise<sqlite3.Database> {
  if (!globalThis.__dbPromise) {
    globalThis.__dbPromise = openDatabase();
  }

  return globalThis.__dbPromise;
}

export type LeadRecord = {
  contactPerson: string;
  contactPhone: string;
  rewardExpectation: string;
};

export async function insertLead(record: LeadRecord): Promise<void> {
  const db = await getDb();

  await new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT INTO leads (contact_person, contact_phone, reward_expectation) VALUES (?, ?, ?)",
      [record.contactPerson, record.contactPhone, record.rewardExpectation],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
}
