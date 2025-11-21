import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getOrCreateStudent } from "../supabaseService.js";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                tgId: number;
                username?: string;
                firstName?: string;
                lastName?: string;
                role: "student" | "admin";
            };
        }
    }
}

const BOT_TOKEN = process.env.BOT_TOKEN;

function verifyTelegramWebAppData(telegramInitData: string): boolean {
    if (!BOT_TOKEN) {
        console.error("BOT_TOKEN is not set!");
        return false;
    }

    const urlParams = new URLSearchParams(telegramInitData);
    const hash = urlParams.get("hash");
    urlParams.delete("hash");

    const params = Array.from(urlParams.entries());
    params.sort((a, b) => a[0].localeCompare(b[0]));

    const dataCheckString = params.map(([key, value]) => `${key}=${value}`).join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    return calculatedHash === hash;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Dev bypass for local testing if needed (can be removed in prod)
    if (process.env.NODE_ENV === "development" && authHeader === "Bearer dev-admin") {
        req.user = {
            tgId: 1472746219, // Hardcoded admin ID
            role: "admin",
            firstName: "Dev",
            lastName: "Admin"
        };
        return next();
    }

    if (!authHeader || !authHeader.startsWith("twa ")) {
        return res.status(401).json({ success: false, error: "unauthorized" });
    }

    const initData = authHeader.slice(4); // Remove "twa " prefix

    if (!verifyTelegramWebAppData(initData)) {
        return res.status(403).json({ success: false, error: "invalid_signature" });
    }

    try {
        const urlParams = new URLSearchParams(initData);
        const userJson = urlParams.get("user");

        if (!userJson) {
            return res.status(400).json({ success: false, error: "missing_user_data" });
        }

        const telegramUser = JSON.parse(userJson);

        // Sync user with database
        const result = await getOrCreateStudent(
            telegramUser.id,
            telegramUser.first_name,
            telegramUser.last_name,
            telegramUser.username
        );

        if (!result.success || !result.data) {
            return res.status(500).json({ success: false, error: "database_sync_failed" });
        }

        req.user = {
            tgId: telegramUser.id,
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            role: result.data.role as "student" | "admin"
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ success: false, error: "internal_auth_error" });
    }
};
