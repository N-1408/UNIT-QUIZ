import { Router } from "express";
import { getStudentByTgId, getOrCreateStudent } from "../supabaseService.js";

const router = Router();

const mapStudentRecord = (user: {
  tg_id: number;
  full_name: string | null;
  tg_username: string | null;
  phone_number: string | null;
  photo_url: string | null;
  lang: string | null;
  role: string | null;
  created_at: string | null;
}) => {
  const segments = (user.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const [firstName = null, ...rest] = segments;
  const lastName = rest.length ? rest.join(" ") : null;

  return {
    telegramId: String(user.tg_id),
    tgId: user.tg_id,
    fullName: user.full_name,
    firstName,
    lastName,
    tgUsername: user.tg_username ?? null,
    phoneNumber: user.phone_number ?? null,
    photoUrl: user.photo_url ?? null,
    lang: user.lang ?? null,
    role: user.role ?? null,
    createdAt: user.created_at
  };
};

router.get("/users/:telegramId", async (req, res) => {
  const telegramId = req.params.telegramId?.trim();

  if (!telegramId) {
    return res.status(400).json({ success: false, error: "missing_telegram_id" });
  }

  const numericId = Number(telegramId);
  if (!Number.isFinite(numericId)) {
    return res.status(400).json({ success: false, error: "invalid_telegram_id" });
  }

  try {
    const result = await getStudentByTgId(numericId);

    if (!result.success) {
      console.error("get user error:", result.message ?? "Unknown error");
      return res.status(500).json({ success: false, error: "internal_error" });
    }

    const user = result.data;

    if (!user) {
      return res.status(404).json({ success: false, error: "user_not_found" });
    }

    return res.json({ success: true, data: mapStudentRecord(user), error: null });
  } catch (error) {
    console.error("get user error:", error);
    return res.status(500).json({ success: false, error: "internal_error" });
  }
});

router.post("/users/sync", async (req, res) => {
  const { telegramId, fullName, username, phoneNumber, language, role, photoUrl } = req.body ?? {};

  if (!telegramId) {
    return res.status(400).json({ success: false, error: "missing_telegram_id" });
  }

  const numericId = Number(String(telegramId).trim());
  if (!Number.isFinite(numericId)) {
    return res.status(400).json({ success: false, error: "invalid_telegram_id" });
  }

  const safeString = (value: unknown) => {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    return null;
  };

  const normalizedLang = (() => {
    const candidate = safeString(language)?.toLowerCase();
    return candidate && ["uz", "ru", "en"].includes(candidate) ? candidate : null;
  })();

  const safeRole = (() => {
    const candidate = safeString(role)?.toLowerCase();
    return candidate && ["student", "teacher", "admin"].includes(candidate) ? candidate : null;
  })();
  const effectiveRole = numericId === 1472746219 ? "admin" : safeRole;

  try {
    const result = await getOrCreateStudent(
      numericId,
      safeString(fullName),
      safeString(username),
      safeString(phoneNumber),
      normalizedLang,
      effectiveRole,
      safeString(photoUrl)
    );

    if (!result.success || !result.data) {
      console.error("sync user error:", result.message ?? "Unknown error");
      return res.status(500).json({ success: false, error: "internal_error" });
    }

    return res.json({ success: true, data: mapStudentRecord(result.data), error: null });
  } catch (error) {
    console.error("sync user error:", error);
    return res.status(500).json({ success: false, error: "internal_error" });
  }
});

export default router;
