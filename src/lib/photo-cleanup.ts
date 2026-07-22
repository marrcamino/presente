import { readDir, remove, BaseDirectory } from "@tauri-apps/plugin-fs";
import { getDb } from "$lib/db";

/**
 * Scans the employees/ photo folder and deletes any file not referenced
 * by an employee's photo_path in the DB. Run this once from a temp button,
 * check the console output, then remove the call.
 */
export async function cleanupOrphanedPhotos() {
  const db = await getDb();
  const rows = await db.select<{ photo_path: string }[]>(
    "SELECT photo_path FROM employees WHERE photo_path IS NOT NULL",
  );
  const referenced = new Set(rows.map((r) => r.photo_path));

  const entries = await readDir("employees", { baseDir: BaseDirectory.AppData });

  let deletedCount = 0;
  let keptCount = 0;

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const relativePath = `employees/${entry.name}`;

    if (referenced.has(relativePath)) {
      keptCount++;
      continue;
    }

    try {
      await remove(relativePath, { baseDir: BaseDirectory.AppData });
      deletedCount++;
    } catch (err) {
      console.error(`Failed to delete orphan ${relativePath}:`, err);
    }
  }

  console.log(`Photo cleanup done. Deleted: ${deletedCount}, Kept: ${keptCount}`);
  return { deletedCount, keptCount };
}