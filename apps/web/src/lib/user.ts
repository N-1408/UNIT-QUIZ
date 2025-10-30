export interface RegisteredUser {
  id: string;
  fullName: string;
  groupId: string;
  teacherId: string;
}

const STORAGE_KEY = 'internation:user';

export function loadUser(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RegisteredUser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to parse stored user', error);
    return null;
  }
}

export function saveUser(user: RegisteredUser) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to persist user', error);
  }
}

export function clearUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
