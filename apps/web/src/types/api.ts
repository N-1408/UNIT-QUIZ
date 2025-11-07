export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export type ExamStatus = "upcoming" | "open" | "closed";

export type ExamSummaryDto = {
  id: number;
  title: string | null;
  description: string | null;
  durationMin: number | null;
  attemptsLimit: number | null;
  startsAt: string | null;
  endsAt: string | null;
  status: ExamStatus;
};

export type ExamQuestionDto = {
  id: number;
  examId: number;
  type: string | null;
  text: string | null;
  points: number | null;
  explanation: string | null;
  options: Array<{
    id: number;
    questionId: number;
    text: string | null;
    isCorrect: boolean | null;
    ord: number | null;
  }> | null;
};

export type ExamDetailDto = ExamSummaryDto & {
  reviewPolicy: string | null;
  passMinCorrect: number | null;
  shuffleQuestions: boolean | null;
  shuffleAnswers: boolean | null;
  backNavLock: boolean | null;
  questions: ExamQuestionDto[] | null;
};

export type AttemptState = "active" | "submitted" | "graded" | "auto_submitted";

export type AttemptSummaryDto = {
  id: number;
  examId: number;
  examTitle: string | null;
  score: number | null;
  state: AttemptState;
  startedAt: string | null;
  submittedAt: string | null;
  durationSpentSec: number | null;
};

export type UserProfileResponse = {
  tgId: number;
  telegramId: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  tgUsername: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  lang: string | null;
  role: string | null;
  createdAt: string | null;
};

export type SubmitAttemptPayload = {
  score?: number | null;
  durationSpentSec?: number | null;
};
