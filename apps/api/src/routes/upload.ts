import { Router } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import fs from "fs";
import { authMiddleware } from "../middleware/auth.js";
import { createQuestion } from "../supabaseService.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);

router.post("/:examId/import", upload.single("file"), async (req, res) => {
    const user = req.user!;
    if (user.role !== "admin") {
        return res.status(403).json({ success: false, error: "forbidden" });
    }

    const examId = Number(req.params.examId);
    if (!Number.isFinite(examId)) {
        return res.status(400).json({ success: false, error: "invalid_exam_id" });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, error: "no_file_uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    try {
        let questions: any[] = [];

        if (mimeType === "application/pdf") {
            // Dynamic import for pdf-parse to handle ESM compatibility
            const pdfParse = (await import("pdf-parse")).default;
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            questions = parsePdfContent(data.text);
        } else if (
            mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            mimeType === "application/vnd.ms-excel"
        ) {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            questions = parseExcelContent(jsonData);
        } else {
            return res.status(400).json({ success: false, error: "unsupported_file_type" });
        }

        // Save questions to DB
        let importedCount = 0;
        for (const q of questions) {
            // Basic validation
            if (!q.text || !q.options || q.options.length < 2) continue;

            const result = await createQuestion(examId, q.text, "single_choice", q.points || 1, q.options);
            if (result.success) {
                importedCount++;
            }
        }

        // Cleanup file
        fs.unlinkSync(filePath);

        return res.json({ success: true, data: { imported: importedCount, totalFound: questions.length } });

    } catch (error) {
        console.error("Import error:", error);
        // Cleanup file on error
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(500).json({ success: false, error: "import_failed" });
    }
});

function parsePdfContent(text: string) {
    // Simple heuristic parser for PDF
    // Expects format:
    // 1. Question text?
    // a) Option 1
    // b) Option 2
    // Answer: a

    const questions: any[] = [];
    const lines = text.split("\n").map(l => l.trim()).filter(l => l);

    let currentQ: any = null;

    for (const line of lines) {
        // Detect Question Start (e.g., "1.", "2)")
        if (/^\d+[\.)]/.test(line)) {
            if (currentQ) questions.push(currentQ);
            currentQ = {
                text: line.replace(/^\d+[\.)]\s*/, ""),
                options: [],
                points: 1
            };
        } else if (currentQ) {
            // Detect Option (e.g., "a)", "A.", "a.")
            const optionMatch = line.match(/^([a-dA-D])[\.)]\s*(.*)/);
            if (optionMatch) {
                currentQ.options.push({
                    text: optionMatch[2],
                    isCorrect: false, // Will resolve later
                    key: optionMatch[1].toLowerCase()
                });
            } else if (line.toLowerCase().startsWith("answer:")) {
                // Detect Answer
                const ansKey = line.split(":")[1].trim().toLowerCase();
                const correctOpt = currentQ.options.find((o: any) => o.key === ansKey);
                if (correctOpt) correctOpt.isCorrect = true;
            } else {
                // Append to question text if not an option/answer
                if (currentQ.options.length === 0) {
                    currentQ.text += " " + line;
                }
            }
        }
    }
    if (currentQ) questions.push(currentQ);

    return questions.map(q => ({
        text: q.text,
        points: q.points,
        options: q.options.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect }))
    }));
}

function parseExcelContent(data: any[]) {
    // Expects columns: Question, Option A, Option B, Option C, Option D, Correct Answer (A/B/C/D), Points
    return data.map((row: any) => {
        const text = row["Question"] || row["question"];
        if (!text) return null;

        const options = [];
        if (row["Option A"]) options.push({ text: row["Option A"], isCorrect: false, key: "a" });
        if (row["Option B"]) options.push({ text: row["Option B"], isCorrect: false, key: "b" });
        if (row["Option C"]) options.push({ text: row["Option C"], isCorrect: false, key: "c" });
        if (row["Option D"]) options.push({ text: row["Option D"], isCorrect: false, key: "d" });

        const correctKey = (row["Correct Answer"] || row["answer"] || "").toString().toLowerCase();
        const correctOpt = options.find(o => o.key === correctKey);
        if (correctOpt) correctOpt.isCorrect = true;

        return {
            text,
            points: Number(row["Points"] || 1),
            options: options.map(o => ({ text: o.text, isCorrect: o.isCorrect }))
        };
    }).filter(q => q !== null);
}

export default router;
