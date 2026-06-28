import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";
import type { ApplicationData } from "./validation";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "applications.db");

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    founder_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_stage TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    demo_link TEXT,
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

export async function insertApplication(data: ApplicationData): Promise<void> {
  const db = await getDb();

  await new Promise<void>((resolve, reject) => {
    db.run(
      `INSERT INTO applications
        (founder_name, contact, project_name, project_stage, problem_description, demo_link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.founderName,
        data.contact,
        data.projectName,
        data.projectStage,
        data.problemDescription,
        data.demoLink ?? "",
      ],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}
