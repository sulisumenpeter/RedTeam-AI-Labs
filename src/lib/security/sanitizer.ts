/**
 * Sanitizer - Neutralizes Cross-Site Scripting (XSS), HTML Injection,
 * and dangerous formatting in user inputs and audit reports.
 */

export function escapeHtml(unsafe: unknown): string {
  if (unsafe === null || unsafe === undefined) {
    return "";
  }
  const str = String(unsafe);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizePlainText(input: unknown): string {
  if (input === null || input === undefined) {
    return "";
  }
  // Strip null bytes and non-printable control characters except standard whitespace
  return String(input)
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

