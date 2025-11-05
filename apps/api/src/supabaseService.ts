import { supabase } from "./supabaseClient.js";

type ServiceSuccess<T> = {
  success: true;
  data: T;
};

type ServiceFailure = {
  success: false;
  error: string;
  details?: unknown;
};

export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure;

export type StudentRecord = {
  id: number;
  tg_id: number;
  full_name: string | null;
  tg_username: string | null;
  phone_number: string | null;
  lang: string | null;
  role: string | null;
  created_at: string;
};

export type AttemptRecord = {
  id: number;
  exam_id: number;
  student_tg_id: number;
  state: "active" | "submitted" | "graded" | "auto_submitted";
  started_at: string | null;
  submitted_at: string | null;
  score: number | null;
  duration_spent_sec: number | null;
  meta: unknown;
};

export type AttemptAnswerRecord = {
  id: number;
  attempt_id: number;
  question_id: number;
  option_ids: number[] | null;
  text_answer: string | null;
  is_flagged: boolean | null;
};

export type ExamWithQuestions = {
  id: number;
  title: string;
  description: string | null;
  duration_min: number | null;
  attempts_limit: number | null;
  shuffle_questions: boolean | null;
  shuffle_answers: boolean | null;
  back_nav_lock: boolean | null;
  review_policy: string | null;
  pass_min_correct: number | null;
  owner_tg_id: number | null;
  is_published: boolean | null;
  created_at: string | null;
  questions: Array<{
    id: number;
    exam_id: number;
    type: string | null;
    text: string | null;
    points: number | null;
    explanation: string | null;
    options: Array<{
      id: number;
      question_id: number;
      text: string | null;
      is_correct: boolean | null;
      ord: number | null;
    }>;
  }>;
};

const handleError = (scope: string, error: unknown): ServiceFailure => {
  console.error(`[Supabase] ${scope} error:`, error);
  if (error && typeof error === "object" && "message" in error) {
    return { success: false, error: String((error as { message: unknown }).message), details: error };
  }
  return { success: false, error: "Unexpected Supabase error", details: error };
};

export async function getStudentByTgId(tg_id: number): Promise<ServiceResult<StudentRecord | null>> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("tg_id", tg_id)
    .maybeSingle();

  if (error) {
    return handleError("getStudentByTgId", error);
  }

  return { success: true, data: data as StudentRecord | null };
}

export async function getOrCreateStudent(
  tg_id: number,
  full_name: string | null,
  tg_username: string | null,
  phone_number: string | null
): Promise<ServiceResult<StudentRecord>> {
  const existing = await getStudentByTgId(tg_id);

  if (!existing.success) {
    return existing;
  }

  if (existing.data) {
    const updates: Partial<StudentRecord> = {};

    if (!existing.data.full_name && full_name) {
      updates.full_name = full_name;
    }

    if (!existing.data.tg_username && tg_username) {
      updates.tg_username = tg_username;
    }

    if (!existing.data.phone_number && phone_number) {
      updates.phone_number = phone_number;
    }

    if (Object.keys(updates).length === 0) {
      return existing as ServiceResult<StudentRecord>;
    }

    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("tg_id", tg_id)
      .select("*")
      .maybeSingle();

    if (error) {
      return handleError("getOrCreateStudent:update", error);
    }

    if (!data) {
      return { success: false, error: "Failed to update student record" };
    }

    return { success: true, data: data as StudentRecord };
  }

  const insertPayload = {
    tg_id,
    full_name,
    tg_username,
    phone_number
  };

  const { data, error } = await supabase
    .from("students")
    .insert(insertPayload)
    .select("*")
    .maybeSingle();

  if (error) {
    return handleError("getOrCreateStudent:insert", error);
  }

  if (!data) {
    return { success: false, error: "Failed to create student record" };
  }

  return { success: true, data: data as StudentRecord };
}

export async function createAttempt(student_tg_id: number, exam_id: number): Promise<ServiceResult<AttemptRecord>> {
  const payload = {
    student_tg_id,
    exam_id,
    state: "active" as AttemptRecord["state"],
    started_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("attempts").insert(payload).select("*").maybeSingle();

  if (error) {
    return handleError("createAttempt", error);
  }

  if (!data) {
    return { success: false, error: "Failed to create attempt" };
  }

  return { success: true, data: data as AttemptRecord };
}

export async function submitAttempt(
  attempt_id: number,
  score: number | null,
  duration_spent_sec: number | null
): Promise<ServiceResult<AttemptRecord>> {
  const payload = {
    state: "submitted" as AttemptRecord["state"],
    score,
    duration_spent_sec,
    submitted_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("attempts").update(payload).eq("id", attempt_id).select("*").maybeSingle();

  if (error) {
    return handleError("submitAttempt", error);
  }

  if (!data) {
    return { success: false, error: "Attempt not found" };
  }

  return { success: true, data: data as AttemptRecord };
}

export async function saveAnswer(
  attempt_id: number,
  question_id: number,
  option_ids: number[] | null,
  text_answer?: string | null
): Promise<ServiceResult<AttemptAnswerRecord>> {
  const payload = {
    attempt_id,
    question_id,
    option_ids: option_ids ?? null,
    text_answer: text_answer ?? null
  };

  const { data, error } = await supabase
    .from("attempt_answers")
    .upsert(payload, { onConflict: "attempt_id,question_id" })
    .select("*")
    .maybeSingle();

  if (error) {
    return handleError("saveAnswer", error);
  }

  if (!data) {
    return { success: false, error: "Failed to save answer" };
  }

  return { success: true, data: data as AttemptAnswerRecord };
}

export async function getExamWithQuestions(exam_id: number): Promise<ServiceResult<ExamWithQuestions | null>> {
  const { data, error } = await supabase
    .from("exams")
    .select(
      `
      id,
      title,
      description,
      duration_min,
      attempts_limit,
      shuffle_questions,
      shuffle_answers,
      back_nav_lock,
      review_policy,
      pass_min_correct,
      owner_tg_id,
      is_published,
      created_at,
      questions:questions (
        id,
        exam_id,
        type,
        text,
        points,
        explanation,
        options:question_options (
          id,
          question_id,
          text,
          is_correct,
          ord
        )
      )
    `
    )
    .eq("id", exam_id)
    .maybeSingle();

  if (error) {
    return handleError("getExamWithQuestions", error);
  }

  return { success: true, data: (data as ExamWithQuestions) ?? null };
}

export async function getStudentAttempts(student_tg_id: number): Promise<ServiceResult<AttemptRecord[]>> {
  const { data, error } = await supabase.from("attempts").select("*").eq("student_tg_id", student_tg_id).order("id", {
    ascending: false
  });

  if (error) {
    return handleError("getStudentAttempts", error);
  }

  return { success: true, data: (data as AttemptRecord[]) ?? [] };
}
