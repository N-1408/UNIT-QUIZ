import { create } from "zustand";

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
  setExamContext: (payload: {
    examId: number;
    attemptId: number | null;
    durationSec: number;
    questionCount: number;
  }) => void;
  setCurrentIndex: (index: number) => void;
  upsertDraft: (draft: Omit<AnswerDraft, "updatedAt">) => void;
  clear: () => void;
};

export const useExamState = create<ExamState>((set) => ({
  currentExamId: null,
  attemptId: null,
  startedAt: null,
  durationSec: 0,
  questionCount: 0,
  currentIndex: 0,
  drafts: {},
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
  clear: () =>
    set({
      currentExamId: null,
      attemptId: null,
      startedAt: null,
      durationSec: 0,
      questionCount: 0,
      currentIndex: 0,
      drafts: {}
    })
}));
