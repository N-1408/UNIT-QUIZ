import type { LanguageCode } from "@/store/useLanguage";
import { supabase } from "@/lib/supabaseClient";
import type {
  ApiResponse,
  ExamDetailDto,
  ExamSummaryDto,
  AttemptSummaryDto,
  SubmitAttemptPayload,
  UserProfileResponse
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

const buildHeaders = (headers?: HeadersInit): HeadersInit => ({
  "Content-Type": "application/json",
  ...headers
});

const buildUrl = (endpoint: string) => {
  const base = API_BASE.replace(/\/$/, "");
  const path = `${API_PREFIX}${endpoint}`;
  return base ? `${base}${path}` : path;
};

async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const url = buildUrl(endpoint);
    console.log("[UNIT-QUIZ] API request →", url);
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers: buildHeaders(options?.headers)
    });

    const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;

    if (!response.ok || !payload.success) {
      throw new Error(payload.error ?? `Request failed (${response.status})`);
    }

    console.info(`[api] ${endpoint} →`, payload.data);
    return {
      success: true,
      data: payload.data,
      error: null
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected API error";
    console.error(`[api] ${endpoint} ×`, message);
    return {
      success: false,
      data: null,
      error: message
    };
  }
}

const fetchAttempts = (tgId: number) => request<AttemptSummaryDto[]>(`/attempts?tgId=${encodeURIComponent(String(tgId))}`);

export const apiClient = {
  syncUser: (input: SyncUserInput) =>
    request<UserProfileResponse>("/users/sync", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  getExams: () => request<ExamSummaryDto[]>("/exams"),

  getExamById: (examId: number) => request<ExamDetailDto>(`/exams/${examId}`),

  getAttempts: fetchAttempts,

  getResults: (tgId: number) => fetchAttempts(tgId),

  submitAttempt: (attemptId: number, payload: SubmitAttemptPayload) =>
    request<AttemptSummaryDto>(`/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getAttemptAnswersDirect: async (attemptId: number) => {
    const { data, error } = await supabase
      .from("attempt_answers")
      .select("*")
      .eq("attempt_id", attemptId);

    if (error) {
      console.error("[api] attempt_answers ×", error);
      return { success: false as const, data: null, error: error.message };
    }

    console.info("[api] attempt_answers →", data);
    return { success: true as const, data, error: null };
  }
};
