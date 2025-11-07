import { create } from "zustand";
import { apiClient } from "@/lib/apiClient";
import type { ExamDetailDto } from "@/types/api";

type AnswerDraft = {
  questionId: number;
  optionIds?: number[];
  textAnswer?: string;
  updatedAt: number;
};

type ExamState = {
  currentExamId: number | null;
  attemptId: number | null;
  startedAt: number | null;
  durationSec: number;
  questionCount: number;
  currentIndex: number;
  drafts: Record<number, AnswerDraft>;
  detail: ExamDetailDto | null;
  detailCache: Record<number, ExamDetailDto | null>;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  setExamContext: (payload: {
    examId: number;
    attemptId: number | null;
    durationSec: number;
    questionCount: number;
  }) => void;
  setCurrentIndex: (index: number) => void;
  upsertDraft: (draft: Omit<AnswerDraft, "updatedAt">) => void;
  fetchExamDetail: (examId: number) => Promise<ExamDetailDto | null>;
  clear: () => void;
};

export const useExamState = create<ExamState>((set, get) => ({
  currentExamId: null,
  attemptId: null,
  startedAt: null,
  durationSec: 0,
  questionCount: 0,
  currentIndex: 0,
  drafts: {},
  detail: null,
  detailCache: {},
  status: "idle",
  error: null,
  setExamContext: ({ examId, attemptId, durationSec, questionCount }) =>
    set({
      currentExamId: examId,
      attemptId,
      startedAt: Date.now(),
      durationSec,
      questionCount,
      currentIndex: 0,
      drafts: {}
    }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  upsertDraft: ({ questionId, optionIds, textAnswer }) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [questionId]: {
          questionId,
          optionIds,
          textAnswer,
          updatedAt: Date.now()
        }
      }
    })),
  fetchExamDetail: async (examId) => {
    const cached = get().detailCache[examId];
    if (cached) {
      set({ detail: cached, status: "ready", error: null });
      return cached;
    }

    set({ status: "loading", error: null });
    const response = await apiClient.getExamById(examId);

    if (response.success && response.data) {
      set((state) => ({
        detail: response.data,
        detailCache: {
          ...state.detailCache,
          [examId]: response.data
        },
        status: "ready",
        error: null
      }));
      return response.data;
    }

    set({ status: "error", error: response.error ?? "Failed to load exam" });
    return null;
  },
  clear: () =>
    set({
      currentExamId: null,
      attemptId: null,
      startedAt: null,
      durationSec: 0,
      questionCount: 0,
      currentIndex: 0,
      drafts: {},
      detail: null,
      status: "idle",
      error: null
    })
}));
