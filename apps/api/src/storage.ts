import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';

type UpsertUserInput = {
  telegramId: string;
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  phoneNumber: string;
};

export type StoredUser = {
  telegramId: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

type UsersFile = {
  users: StoredUser[];
  savedAt: string;
};

const DEFAULT_DB_PATH = fileURLToPath(new URL('../../../db/users.json', import.meta.url));

function resolveDatabasePath(spec?: string) {
  if (!spec || spec.trim().length === 0) {
    return DEFAULT_DB_PATH;
  }
  if (spec.startsWith('file:')) {
    return fileURLToPath(spec);
  }
  return path.isAbsolute(spec) ? spec : path.resolve(process.cwd(), spec);
}

const databasePath = resolveDatabasePath(env.DATABASE_URL);
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const state = new Map<string, StoredUser>();

function loadUsersFromDisk() {
  try {
    const raw = fs.readFileSync(databasePath, 'utf8');
    const parsed = JSON.parse(raw) as UsersFile;
    if (Array.isArray(parsed?.users)) {
      parsed.users.forEach((user) => {
        if (typeof user.telegramId === 'string') {
          state.set(user.telegramId, user);
        }
      });
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('Failed to read users database, starting fresh:', error);
    }
    persistUsers();
  }
}

function persistUsers() {
  const payload: UsersFile = {
    users: Array.from(state.values()),
    savedAt: new Date().toISOString()
  };
  fs.writeFileSync(databasePath, JSON.stringify(payload, null, 2), 'utf8');
}

loadUsersFromDisk();

export const usersStore = {
  upsert(input: UpsertUserInput) {
    const existing = state.get(input.telegramId);
    const now = new Date().toISOString();

    if (existing) {
      const updated: StoredUser = {
        ...existing,
        firstName: input.firstName || existing.firstName,
        lastName: input.lastName ?? existing.lastName,
        username: input.username ?? existing.username,
        phoneNumber: input.phoneNumber || existing.phoneNumber,
        updatedAt: now
      };
      state.set(input.telegramId, updated);
    } else {
      const created: StoredUser = {
        telegramId: input.telegramId,
        firstName: input.firstName,
        lastName: input.lastName ?? null,
        username: input.username ?? null,
        phoneNumber: input.phoneNumber,
        createdAt: now,
        updatedAt: now
      };
      state.set(input.telegramId, created);
    }

    persistUsers();
  },
  findByTelegramId(telegramId: string): StoredUser | null {
    return state.get(telegramId) ?? null;
  }
};
