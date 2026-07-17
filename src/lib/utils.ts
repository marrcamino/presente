/**
 * Formats a date (Date object or ISO string) into a readable string.
 *
 * @param input - A Date object or a date string (e.g. "1987-07-12T00:00:00.000Z").
 * @param options - Optional settings.
 * @param options.format - Format style:
 *   - `'long'` (default): e.g. "July 12, 1987"
 *   - `'short'`: e.g. "Jul 12, 1987"
 *   - `'numeric'`: e.g. "07/12/1987"
 *
 * @defaultReturn Current date if no input is provided.
 * @returns A formatted date string.
 */
export function formatDate(
  input: Date | string = new Date(),
  format?: "long" | "short" | "numeric"
): string {
  const date = typeof input === "string" ? new Date(input) : input;

  if (isNaN(date.getTime())) return "Invalid Date";

  format = format ?? "short";

  const formatOptions: Intl.DateTimeFormatOptions =
    format === "numeric"
      ? { month: "2-digit", day: "2-digit", year: "numeric" }
      : format === "short"
        ? { month: "short", day: "numeric", year: "numeric" }
        : { month: "long", day: "numeric", year: "numeric" };

  return new Intl.DateTimeFormat("en-US", formatOptions).format(date);
}