import type { LanguageCode } from "@/store/useLanguage";

import type {
  ApiResponse,
  ExamDetailDto,
  ExamSummaryDto,
  AttemptSummaryDto,
  SubmitAttemptPayload,
  UserProfileResponse,
  UploadQuestionsResponse
} from "@/types/api";

type SyncUserInput = {
  telegramId: number;
  fullName: string;
  username: string | null;
  language?: LanguageCode;
  phoneNumber?: string | null;
  role?: string | null;
  photoUrl?: string | null;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const API_PREFIX = "/api";
const CACHE_DURATION_MS = 5 * 60 * 1000;

const buildHeaders = (headers?: HeadersInit): HeadersInit => {
  const webApp = (window as any).Telegram?.WebApp;
  const initData = webApp?.initData || "";

  // In dev mode, if no initData, we might want to use a dummy token if backend allows
  // For now, we send what we have.

  return {
    "Content-Type": "application/json",
    "Authorization": `twa ${initData}`,
    ...headers
  };
};

const buildUrl = (endpoint: string) => {
  const base = API_BASE.replace(/\/$/, "");
  const path = `${API_PREFIX}${endpoint}`;
  return base ? `${base}${path}` : path;
};

const isBrowser = () => typeof window !== "undefined";
const cacheKey = (endpoint: string) => `cache:${endpoint}`;

const readCache = <T>(endpoint: string): ApiResponse<T> | null => {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(cacheKey(endpoint));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ApiResponse<T>;
  } catch {
    localStorage.removeItem(cacheKey(endpoint));
    return null;
  }
};

const writeCache = <T>(endpoint: string, payload: ApiResponse<T>) => {
  if (!isBrowser()) return;
  const key = cacheKey(endpoint);
  localStorage.setItem(key, JSON.stringify(payload));
  window.setTimeout(() => {
    if (isBrowser()) {
      localStorage.removeItem(key);
    }
  }, CACHE_DURATION_MS);
};

const clearCache = () => {
  if (!isBrowser()) return;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("cache:")) {
      localStorage.removeItem(key);
    }
  });
};

async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const method = options?.method?.toUpperCase() ?? "GET";

  if (method === "GET") {
    const cached = readCache<T>(endpoint);
    if (cached) {
      return cached;
    }
  }

  try {
    const url = buildUrl(endpoint);
    console.log("[UNIT-QUIZ] API request ��'", url);
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers: buildHeaders(options?.headers)
    });

    const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;

    if (!response.ok || !payload.success) {
      throw new Error(payload.error ?? `Request failed (${response.status})`);
    }

    console.info(`[api] ${endpoint} ��'`, payload.data);

    const normalized: ApiResponse<T> = {
      success: true,
      data: payload.data,
      error: null
    };

    if (method === "GET") {
      writeCache(endpoint, normalized);
    } else {
      clearCache();
    }

    return normalized;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected API error";
    console.error(`[api] ${endpoint} �-`, message);
    return {
      success: false,
      data: null,
      error: message
    };
  }
}

const fetchAttempts = (tgId: number) => request<AttemptSummaryDto[]>(`/attempts?tgId=${encodeURIComponent(String(tgId))}`);

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok) {
    return {
      success: false,
      data: null,
      error: payload.error || `HTTP Error ${response.status}`
    };
  }
  return payload;
}

export const apiClient = {
  // User & Profile
  // User & Profile
  getCurrentUser: async () => {
    const res = await request<{ tgId: number; username?: string; firstName?: string; lastName?: string; role: string }>("/users/me");
    if (res.success) return res;

    console.warn("[Mock] Returning mock user");
    return {
      success: true,
      data: { tgId: 123456789, firstName: "Guest", role: "student" },
      error: null
    };
  },

  syncUser: (input: SyncUserInput) =>
    request<UserProfileResponse>("/users/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    }),

  getExams: async () => {
    const res = await request<ExamSummaryDto[]>("/exams");
    if (res.success) return res;

    console.warn("[Mock] Returning mock exams");
    return {
      success: true,
      data: [
        {
          id: 101,
          title: "General English: Level A2",
          description: "Test your basic grammar and vocabulary skills.",
          durationMin: 40,
          attemptsLimit: 1,
          startsAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          status: "open" as const
        },
        {
          id: 102,
          title: "IELTS Mock: Reading & Listening",
          description: "Full-length practice for the IELTS exam.",
          durationMin: 60,
          attemptsLimit: 1,
          startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          endsAt: null,
          status: "upcoming" as const
        }
      ],
      error: null
    };
  },

  getExamById: async (examId: number) => {
    const res = await request<ExamDetailDto>(`/exams/${examId}`);
    if (res.success) return res;

    console.warn("[Mock] Returning mock exam detail");
    return {
      success: true,
      data: {
        id: examId,
        title: "General English: Level A2",
        description: "Test your basic grammar and vocabulary skills.",
        durationMin: 40,
        attemptsLimit: 1,
        startsAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        status: "open" as const,
        questions: [
          {
            id: 1,
            examId: examId,
            text: "Choose the correct option: I ___ to the store yesterday.",
            type: "single_choice",
            points: 1,
            explanation: null,
            imageUrl: null,
            audioUrl: null,
            options: [
              { id: 1, questionId: 1, text: "go", ord: 1 },
              { id: 2, questionId: 1, text: "went", ord: 2 },
              { id: 3, questionId: 1, text: "gone", ord: 3 },
              { id: 4, questionId: 1, text: "going", ord: 4 }
            ]
          },
          {
            id: 2,
            examId: examId,
            text: "Which sentence is correct?",
            type: "single_choice",
            points: 1,
            explanation: null,
            imageUrl: null,
            audioUrl: null,
            options: [
              { id: 5, questionId: 2, text: "She don't like apples.", ord: 1 },
              { id: 6, questionId: 2, text: "She doesn't likes apples.", ord: 2 },
              { id: 7, questionId: 2, text: "She doesn't like apples.", ord: 3 },
              { id: 8, questionId: 2, text: "She not like apples.", ord: 4 }
            ]
          }
        ],
        reviewPolicy: "always",
        passMinCorrect: 50,
        shuffleQuestions: false,
        shuffleAnswers: false,
        backNavLock: false
      } as ExamDetailDto,
      error: null
    };
  },

  getAttempts: async (tgId: number) => {
    const res = await fetchAttempts(tgId);
    if (res.success) return res;
    return { success: true, data: [], error: null };
  },

  getResults: (tgId: number) => fetchAttempts(tgId),

  createAttempt: async (examId: number, studentTgId: number) => {
    const res = await request<AttemptSummaryDto>("/attempts", {
      method: "POST",
      body: JSON.stringify({ examId, studentTgId })
    });
    if (res.success) return res;

    console.warn("[Mock] Creating mock attempt");
    return {
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000),
        examId,
        examTitle: "Mock Exam",
        studentId: studentTgId,
        score: null,
        startedAt: new Date().toISOString(),
        submittedAt: null,
        state: "active" as const,
        durationSpentSec: 0
      },
      error: null
    };
  },

  createExam: (payload: {
    title: string;
    description: string;
    durationMin: number;
    startTime: string;
    endTime: string;
  }) =>
    request<ExamSummaryDto>("/exams", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  createQuestion: async (examId: number, payload: any) => {
    const res = await fetch(`${buildUrl(`/exams/${examId}/questions`)}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  uploadQuestions: async (examId: number, file: File): Promise<ApiResponse<UploadQuestionsResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    const webApp = (window as any).Telegram?.WebApp;
    const initData = webApp?.initData || "";

    const res = await fetch(`${buildUrl(`/upload/${examId}/import`)}`, {
      method: "POST",
      headers: {
        "Authorization": `twa ${initData}`
        // Content-Type is automatically set by browser for FormData
      },
      body: formData,
    });
    return handleResponse<UploadQuestionsResponse>(res);
  },

  submitAttempt: async (attemptId: number, payload: SubmitAttemptPayload) => {
    const res = await request<AttemptSummaryDto>(`/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (res.success) return res;

    console.warn("[Mock] Submitting mock attempt");
    // Calculate mock score
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    return {
      success: true,
      data: {
        id: attemptId,
        examId: 101,
        examTitle: "General English: Level A2",
        studentId: 123456789,
        score,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        submittedAt: new Date().toISOString(),
        state: "graded" as const,
        durationSpentSec: payload.durationSpentSec
      },
      error: null
    };
  },


};
