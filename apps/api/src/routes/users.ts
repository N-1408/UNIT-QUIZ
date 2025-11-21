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

// GET /api/users/me - Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user!; // req.user is populated by authMiddleware

  try {
    // We use getOrCreateStudent here to ensure the user record is up-to-date
    // and to fetch the latest role from the database.
    const result = await getOrCreateStudent(
      user.tgId,
      user.firstName || null, // Pass null if empty string
      user.lastName || null,  // Pass null if empty string
      user.username || null,
      null, // lang is not typically part of the /me payload for update
      null, // role is not typically part of the /me payload for update
      null  // photoUrl is not typically part of the /me payload for update
    );

    if (!result.success || !result.data) {
      console.error("Error fetching user profile for /me:", result.message ?? "Unknown error");
      return res.status(500).json({ success: false, error: 'failed_to_fetch_profile' });
    }

    return res.json({
      success: true,
      data: {
        tgId: user.tgId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: result.data.role // Use the role from the database
      },
      error: null
    });
  } catch (error) {
    console.error('Error fetching user profile for /me:', error);
    return res.status(500).json({ success: false, error: 'internal_error' });
  }
});

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

  console.log("[UNIT-QUIZ] Raw request dump:", {
    method: req.method,
    query: req.query,
    bodyKeys: Object.keys(req.body || {}),
    body: req.body
  });

  const telegramIdSources = [
    req.query?.telegramId,
    body?.telegramId,
    body?.user?.id,
    body?.from?.id,
    body?.message?.from?.id,
    body?.chat?.id
  ];

  console.log("[UNIT-QUIZ] ID candidates:", telegramIdSources);

  const validIds = telegramIdSources.filter((value) => value && !Number.isNaN(Number(value)));
  const telegramId = validIds.length ? Number(validIds[0]) : null;

  if (!telegramId) {
    console.error("[UNIT-QUIZ] Invalid telegramId from all sources:", telegramIdSources);
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
      telegramId,
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
    console.log("[UNIT-QUIZ] Sync response:", {
      telegramId: mapped.tgId,
      role: mapped.role,
      fullName: mapped.fullName,
      username: mapped.tgUsername,
      phoneNumber: mapped.phoneNumber,
      photoUrl: mapped.photoUrl
    });
    return res.json({ success: true, data: mapped, error: null });
  } catch (error) {
    console.error("sync user error:", error);
    return res.status(500).json({ success: false, error: "internal_error" });
  }
});

export default router;
