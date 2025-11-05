export function getApiBase() {
  const envValue = (import.meta.env.VITE_API_URL ?? '').trim();
  if (envValue.length > 0) {
    return envValue.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return '';
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBase()}${normalizedPath}`;
}
