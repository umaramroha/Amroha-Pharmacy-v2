// Language helpers for Health Tips. Safe to import from client components.
export type TipLang = "en" | "hi";

export const LANG_STORAGE_KEY = "health-tips-lang";

/** English article lives at /blogs/<slug>, Hindi article at /blogs/hi/<slug>. */
export function tipPath(slug: string, lang: TipLang): string {
  return lang === "hi" ? `/blogs/hi/${slug}` : `/blogs/${slug}`;
}

export function readSavedLang(): TipLang | null {
  try {
    const v = window.localStorage.getItem(LANG_STORAGE_KEY);
    return v === "en" || v === "hi" ? v : null;
  } catch {
    return null;
  }
}

export function saveLang(lang: TipLang): void {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* private mode or blocked storage: the choice just is not remembered */
  }
}

export function browserPrefersHindi(): boolean {
  try {
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return first.toLowerCase().startsWith("hi");
  } catch {
    return false;
  }
}
