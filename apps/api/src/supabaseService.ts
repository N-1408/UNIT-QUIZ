import { supabase } from "./supabaseClient.js";

export type ServiceResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

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

export type AttemptWithExamRecord = AttemptRecord & {
  exams?: {
    title: string | null;
    duration_min: number | null;
  };
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

export type ExamSummaryRecord = {
  id: number;
  title: string;
  description: string | null;
  duration_min: number | null;
  attempts_limit: number | null;
  review_policy: string | null;
  pass_min_correct: number | null;
  is_published: boolean | null;
  created_at: string | null;
};

const createError = <T>(scope: string, error: unknown): ServiceResult<T> => {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : "Unexpected Supabase error";

  console.error(`[Supabase] ${scope} error:`, error);

  return {
    success: false,
    message
  };
};

const createSuccess = <T>(data: T, message = "OK"): ServiceResult<T> => ({
  success: true,
  data,
  message
});

export async function listExams(): Promise<ServiceResult<ExamSummaryRecord[]>> {
  const { data, error } = await supabase
    .from("exams")
    .select("id,title,description,duration_min,attempts_limit,review_policy,pass_min_correct,is_published,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return createError("listExams", error);
  }

  return createSuccess((data as ExamSummaryRecord[]) ?? []);
}

export async function getStudentByTgId(tg_id: number): Promise<ServiceResult<StudentRecord | null>> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("tg_id", tg_id)
    .maybeSingle();

  if (error) {
    return createError("getStudentByTgId", error);
  }

  return createSuccess(data as StudentRecord | null);
}

export async function getOrCreateStudent(
  tg_id: number,
  full_name: string | null,
  tg_username: string | null,
  phone_number: string | null,
  lang?: string | null,
  role?: string | null
): Promise<ServiceResult<StudentRecord>> {
  const existing = await getStudentByTgId(tg_id);

  if (!existing.success) {
    return existing;
  }

  if (existing.data) {
    const updates: Partial<StudentRecord> = {};

    if (full_name && full_name !== existing.data.full_name) {
      updates.full_name = full_name;
    }

    if (tg_username && tg_username !== existing.data.tg_username) {
      updates.tg_username = tg_username;
    }

    if (phone_number && phone_number !== existing.data.phone_number) {
      updates.phone_number = phone_number;
    }

    if (lang && lang !== existing.data.lang) {
      updates.lang = lang;
    }

    if (role && role !== existing.data.role) {
      updates.role = role;
    }

    if (Object.keys(updates).length === 0) {
      return createSuccess(existing.data);
    }

    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("tg_id", tg_id)
      .select("*")
      .maybeSingle();

    if (error) {
      return createError("getOrCreateStudent:update", error);
    }

    if (!data) {
      return { success: false, message: "Failed to update student record" };
    }

    return createSuccess(data as StudentRecord);
  }

  const fallbackRole = role ?? "student";
  const insertPayload = {
    tg_id,
    full_name,
    tg_username,
    phone_number,
    lang,
    role: fallbackRole
  };

  const { data, error } = await supabase
    .from("students")
    .insert(insertPayload)
    .select("*")
    .maybeSingle();

  if (error) {
    return createError("getOrCreateStudent:insert", error);
  }

  if (!data) {
    return { success: false, message: "Failed to create student record" };
  }

  return createSuccess(data as StudentRecord);
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
    return createError("createAttempt", error);
  }

  if (!data) {
    return { success: false, message: "Failed to create attempt" };
  }

  return createSuccess(data as AttemptRecord);
}

export async function submitAttempt(
  attempt_id: number,
  score: number | null,
  duration_spent_sec: number | null
): Promise<ServiceResult<AttemptWithExamRecord>> {
  const payload = {
    state: "submitted" as AttemptRecord["state"],
    score,
    duration_spent_sec,
    submitted_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("attempts")
    .update(payload)
    .eq("id", attempt_id)
    .select(
      `
      id,
      exam_id,
      student_tg_id,
      state,
      started_at,
      submitted_at,
      score,
      duration_spent_sec,
      meta,
      exams:exam_id (
        title,
        duration_min
      )
    `
    )
    .maybeSingle();

  if (error) {
    return createError("submitAttempt", error);
  }

  if (!data) {
    return { success: false, message: "Attempt not found" };
  }

  return createSuccess(data as AttemptWithExamRecord);
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
    return createError("saveAnswer", error);
  }

  if (!data) {
    return { success: false, message: "Failed to save answer" };
  }

  return createSuccess(data as AttemptAnswerRecord);
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
    return createError("getExamWithQuestions", error);
  }

  return createSuccess((data as ExamWithQuestions) ?? null);
}

export async function getStudentAttempts(student_tg_id: number): Promise<ServiceResult<AttemptWithExamRecord[]>> {
  const { data, error } = await supabase
    .from("attempts")
    .select(
      `
      id,
      exam_id,
      student_tg_id,
      state,
      started_at,
      submitted_at,
      score,
      duration_spent_sec,
      meta,
      exams:exam_id (
        title,
        duration_min
      )
    `
    )
    .eq("student_tg_id", student_tg_id)
    .order("id", {
      ascending: false
    });

  if (error) {
    return createError("getStudentAttempts", error);
  }

  return createSuccess((data as AttemptWithExamRecord[]) ?? []);
}

export async function getAttemptById(attempt_id: number): Promise<ServiceResult<AttemptWithExamRecord | null>> {
  const { data, error } = await supabase
    .from("attempts")
    .select(
      `
      id,
      exam_id,
      student_tg_id,
      state,
      started_at,
      submitted_at,
      score,
      duration_spent_sec,
      meta,
      exams:exam_id (
        title,
        duration_min
      )
    `
    )
    .eq("id", attempt_id)
    .maybeSingle();

  if (error) {
    return createError("getAttemptById", error);
  }

  return createSuccess((data as AttemptWithExamRecord) ?? null);
}
