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
  const body = req.body ?? {};

  const parseId = (value: unknown): number | null => {
    if (value === undefined || value === null) return null;
    const numeric = Number(String(value).trim());
    return Number.isFinite(numeric) ? numeric : null;
  };

  const candidates = [
    req.query?.telegramId,
    body.telegramId,
    body?.user?.id,
    body?.from?.id,
    body?.message?.from?.id
  ];

  const numericId = candidates.reduce<number | null>(
    (acc, current) => (acc !== null ? acc : parseId(current)),
    null
  );

  console.log("[UNIT-QUIZ] Sync payload received:", {
    raw: candidates,
    update_id: body?.update_id
  });

  if (numericId === null) {
    console.warn("[UNIT-QUIZ] Invalid telegramId:", candidates);
    return res.status(400).json({ success: false, error: "invalid_telegram_id" });
  }

  const { fullName, username, phoneNumber, language, role, photoUrl } = body;

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

  try {
    const result = await getOrCreateStudent(
      numericId,
      safeString(fullName),
      safeString(username),
      safeString(phoneNumber),
      normalizedLang,
      safeRole,
      safeString(photoUrl)
    );

    if (!result.success || !result.data) {
      console.error("sync user error:", result.message ?? "Unknown error");
      return res.status(500).json({ success: false, error: "internal_error" });
    }

    const mapped = mapStudentRecord(result.data);
    console.log("[UNIT-QUIZ] Sync response:", mapped);
    return res.json({ success: true, data: mapped, error: null });
  } catch (error) {
    console.error("sync user error:", error);
    return res.status(500).json({ success: false, error: "internal_error" });
  }
});

export default router;
