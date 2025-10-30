export type Theme = 'light' | 'dark';

const KEY = 'internation:theme';

export function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    /* ignore */
  }
  return 'light';
}

export function setTheme(theme: Theme) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }
  try {
    document.documentElement.dataset.theme = theme;
  } catch {
    /* ignore */
  }
}

export function applyInitialTheme() {
  const theme = getTheme();
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
  }
}
