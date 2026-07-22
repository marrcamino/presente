import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, join } from "@tauri-apps/api/path";

let cachedAppDataDir: string | null = null;

async function getAppDataDir(): Promise<string> {
  if (!cachedAppDataDir) {
    cachedAppDataDir = await appDataDir();
  }
  return cachedAppDataDir;
}

/**
 * Resolves a relative photo path (e.g. "employees/4.jpg", as stored in the DB)
 * into a src usable by <img>, by joining it against the app data dir and
 * converting it through Tauri's asset protocol.
 */
export async function resolvePhotoSrc(
  relativePath: string | null,
): Promise<string | null> {
  if (!relativePath) return null;
  const dir = await getAppDataDir();
  const full = await join(dir, relativePath);
  return convertFileSrc(full);
}