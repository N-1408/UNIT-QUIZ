const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE_URL is not defined. Requests will target relative paths.');
}

async function request<T>(path: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL ?? ''}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export const api = {
  getTests: () => request<{ id: number; title: string; duration_sec: number }[]>('/tests'),
  submitTest: (payload: unknown) =>
    request<{ ok: boolean }>('/submissions', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
