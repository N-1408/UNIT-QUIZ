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
  photo_url: string | null;
  lang: string | null;
  role: string | null;
  created_at: string;
};

export type ExamRecord = {
  id: number;
  title: string;
  description: string | null;
  duration_min: number;
  start_time: string | null;
  end_time: string | null;
  access_code: string | null;
  attempts_limit: number | null;
  pass_min_correct: number | null;
  shuffle_questions: boolean | null;
  shuffle_answers: boolean | null;
  review_policy: string | null;
  is_published: boolean | null;
  owner_tg_id: number | null;
  created_at: string;
};

export type QuestionRecord = {
  id: number;
  exam_id: number;
  type: string;
  text: string;
  image_url: string | null;
  audio_url: string | null;
  points: number;
  explanation: string | null;
  options: Array<{
    id: number;
    question_id: number;
    text: string;
    is_correct: boolean;
    ord: number;
  }>;
};

export type AttemptRecord = {
  id: number;
  exam_id: number;
  student_tg_id: number;
  state: "active" | "submitted" | "graded";
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  duration_spent_sec: number | null;
  meta: unknown;
};

export type AttemptWithExamRecord = AttemptRecord & {
  exams?: {
    title: string | null;
    duration_min: number | null;
  } | null;
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

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function listExams(): Promise<ServiceResult<ExamRecord[]>> {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return createError("listExams", error);
  }

  return createSuccess((data as ExamRecord[]) ?? []);
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
  role?: string | null,
  photo_url?: string | null
): Promise<ServiceResult<StudentRecord>> {
  // Hardcoded admin check (legacy support)
  let normalizedRole = role ?? "student";
  if (tg_id === 1472746219) {
    normalizedRole = "admin";
  }

  const existing = await getStudentByTgId(tg_id);

  if (!existing.success) return existing;

  if (existing.data) {
    const updates: Partial<StudentRecord> = {};
    if (full_name && full_name !== existing.data.full_name) updates.full_name = full_name;
    if (tg_username && tg_username !== existing.data.tg_username) updates.tg_username = tg_username;
    if (phone_number && phone_number !== existing.data.phone_number) updates.phone_number = phone_number;
    if (photo_url && photo_url !== existing.data.photo_url) updates.photo_url = photo_url;

    if (Object.keys(updates).length === 0) return createSuccess(existing.data);

    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("tg_id", tg_id)
      .select("*")
      .maybeSingle();

    if (error) return createError("getOrCreateStudent:update", error);
    return createSuccess(data as StudentRecord);
  }

  const { data, error } = await supabase
    .from("students")
    .insert({
      tg_id,
      full_name,
      tg_username,
      phone_number,
      photo_url,
      lang,
      role: normalizedRole
    })
    .select("*")
    .maybeSingle();

  if (error) return createError("getOrCreateStudent:insert", error);
  return createSuccess(data as StudentRecord);
}

export async function createAttempt(student_tg_id: number, exam_id: number): Promise<ServiceResult<AttemptRecord>> {
  // Check if exam is open
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("start_time, end_time, is_published")
    .eq("id", exam_id)
    .single();

  if (examError || !exam) return createError("createAttempt:checkExam", examError ?? "Exam not found");

  const now = new Date();
  if (!exam.is_published) return { success: false, message: "Exam is not published" };
  if (exam.start_time && now < new Date(exam.start_time)) return { success: false, message: "Exam has not started yet" };
  if (exam.end_time && now > new Date(exam.end_time)) return { success: false, message: "Exam has ended" };

  const payload = {
    student_tg_id,
    exam_id,
    state: "active",
    started_at: now.toISOString()
  };

  const { data, error } = await supabase.from("attempts").insert(payload).select("*").maybeSingle();

  if (error) return createError("createAttempt", error);
  return createSuccess(data as AttemptRecord);
}

export async function gradeAndSubmitAttempt(
  attempt_id: number,
  answers: Record<number, number>, // questionId -> optionId
  duration_spent_sec: number
): Promise<ServiceResult<AttemptWithExamRecord>> {
  // 1. Fetch attempt and exam questions
  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .select("*, exams(*)")
    .eq("id", attempt_id)
    .single();

  if (attemptError || !attempt) return createError("gradeAttempt:fetchAttempt", attemptError);
  if (attempt.state !== "active") return { success: false, message: "Attempt already submitted" };

  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id, points, options:question_options(id, is_correct)")
    .eq("exam_id", attempt.exam_id);

  if (qError || !questions) return createError("gradeAttempt:fetchQuestions", qError);

  // 2. Calculate score
  let totalPoints = 0;
  let maxPoints = 0;
  const answerRecords = [];

  for (const q of questions) {
    const selectedOptionId = answers[q.id];
    const correctOption = q.options.find((o: any) => o.is_correct);
    const isCorrect = correctOption && correctOption.id === selectedOptionId;
    const points = isCorrect ? (q.points ?? 1) : 0;

    if (isCorrect) totalPoints += points;
    maxPoints += (q.points ?? 1);

    answerRecords.push({
      attempt_id,
      question_id: q.id,
      option_ids: selectedOptionId ? [selectedOptionId] : [],
      is_correct: isCorrect,
      points_awarded: points
    });
  }

  const finalScore = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  // 3. Save answers
  const { error: ansError } = await supabase.from("attempt_answers").insert(answerRecords);
  if (ansError) console.error("Failed to save answers details", ansError);

  // 4. Update attempt
  const { data: updated, error: updateError } = await supabase
    .from("attempts")
    .update({
      state: "submitted",
      submitted_at: new Date().toISOString(),
      score: finalScore,
      duration_spent_sec
    })
    .eq("id", attempt_id)
    .select("*, exams(title, duration_min)")
    .single();

  if (updateError) return createError("gradeAttempt:update", updateError);

  return createSuccess(updated as AttemptWithExamRecord);
}

export async function getExamWithQuestions(exam_id: number): Promise<ServiceResult<ExamRecord & { questions: QuestionRecord[] }>> {
  const { data, error } = await supabase
    .from("exams")
    .select(`
      *,
      questions (
        id, exam_id, type, text, image_url, audio_url, points, explanation,
        options:question_options (id, question_id, text, is_correct, ord)
      )
    `)
    .eq("id", exam_id)
    .maybeSingle();

  if (error) return createError("getExamWithQuestions", error);
  return createSuccess(data as any);
}

export async function getStudentAttempts(student_tg_id: number): Promise<ServiceResult<AttemptWithExamRecord[]>> {
  const { data, error } = await supabase
    .from("attempts")
    .select("*, exams(title, duration_min)")
    .eq("student_tg_id", student_tg_id)
    .order("id", { ascending: false });

  if (error) return createError("getStudentAttempts", error);
  return createSuccess((data as AttemptWithExamRecord[]) ?? []);
}

export async function createExam(
  owner_tg_id: number,
  title: string,
  description: string | null,
  duration_min: number,
  start_time: string | null,
  end_time: string | null
): Promise<ServiceResult<ExamRecord>> {
  const { data, error } = await supabase
    .from("exams")
    .insert({
      owner_tg_id,
      title,
      description,
      duration_min,
      start_time,
      end_time,
      is_published: false // Default to draft
    })
    .select("*")
    .single();

  if (error) return createError("createExam", error);
  return createSuccess(data as ExamRecord);
}

export async function createQuestion(
  exam_id: number,
  text: string,
  type: string,
  points: number,
  options: { text: string; is_correct: boolean }[]
): Promise<ServiceResult<QuestionRecord>> {
  // 1. Create Question
  const { data: question, error: qError } = await supabase
    .from("questions")
    .insert({
      exam_id,
      text,
      type,
      points
    })
    .select("*")
    .single();

  if (qError || !question) return createError("createQuestion:insert", qError);

  // 2. Create Options
  const optionRecords = options.map((opt, idx) => ({
    question_id: question.id,
    text: opt.text,
    is_correct: opt.is_correct,
    ord: idx
  }));

  const { error: oError } = await supabase.from("question_options").insert(optionRecords);

  if (oError) return createError("createQuestion:options", oError);

  return createSuccess({ ...question, options: [] } as QuestionRecord); // Return basic record
}

