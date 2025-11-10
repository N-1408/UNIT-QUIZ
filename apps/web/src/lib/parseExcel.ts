import * as XLSX from "xlsx";

type ParseResult = {
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    imageUrl?: string | null;
    audioUrl?: string | null;
  }>;
  errors: string[];
};

const REQUIRED_HEADERS = ["Question", "Option_A", "Option_B", "Option_C", "Option_D", "Correct"];

export const parseExcelFile = async (file: File): Promise<ParseResult> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    const errors: string[] = [];
    const questions: ParseResult["questions"] = [];

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

        if (!rows.length) {
          errors.push("❌ Fayl bo'sh ko'rinmoqda.");
          resolve({ questions, errors });
          return;
        }

        const headers = rows[0];
        const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));

        if (missingHeaders.length) {
          errors.push(`❌ Yetishmayotgan ustunlar: ${missingHeaders.join(", ")}`);
          resolve({ questions, errors });
          return;
        }

        for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
          const row = rows[rowIndex];
          if (!row || !row.length || !row[0]) continue;

          const getValue = (header: string) => row[headers.indexOf(header)];

          const question = {
            id: `q-${rowIndex}`,
            text: String(getValue("Question") ?? "").trim(),
            options: [
              String(getValue("Option_A") ?? "").trim(),
              String(getValue("Option_B") ?? "").trim(),
              String(getValue("Option_C") ?? "").trim(),
              String(getValue("Option_D") ?? "").trim()
            ],
            correctAnswer: ["A", "B", "C", "D"].indexOf(String(getValue("Correct") ?? "").toUpperCase()),
            imageUrl: (getValue("Image_URL(optional)") as string) ?? null,
            audioUrl: (getValue("Audio_URL(optional)") as string) ?? null
          };

          if (!question.text) {
            errors.push(`❌ ${rowIndex + 1}-qator: savol matni mavjud emas.`);
          }
          if (question.options.some((option) => !option)) {
            errors.push(`❌ ${rowIndex + 1}-qator: barcha variantlar to'ldirilmagan.`);
          }
          if (question.correctAnswer === -1) {
            errors.push(`❌ ${rowIndex + 1}-qator: Correct ustunida faqat A/B/C/D bo'lishi kerak.`);
          }

          if (question.text && question.options.every(Boolean) && question.correctAnswer !== -1) {
            questions.push(question);
          }
        }
      } catch (error) {
        errors.push(`❌ Excel faylini o'qib bo'lmadi: ${(error as Error).message}`);
      }

      resolve({ questions, errors });
    };

    reader.onerror = () => {
      errors.push("❌ Faylni o'qishda xatolik yuz berdi.");
      resolve({ questions, errors });
    };

    reader.readAsArrayBuffer(file);
  });
