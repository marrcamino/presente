import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    db = await Database.load('sqlite:presente.db');
  }
  return db;
}