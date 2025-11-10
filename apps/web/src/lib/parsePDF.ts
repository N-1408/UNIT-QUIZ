// eslint-disable-next-line import/no-unresolved
import pdf from "pdf-parse/lib/pdf-parse.js";

type ParsedQuestion = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
};

type ParseResult = {
  questions: ParsedQuestion[];
  errors: string[];
};

export const parsePDFFile = async (file: File): Promise<ParseResult> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    const errors: string[] = ["⚠️ PDF parsing is experimental. Manual verification required."];
    const questions: ParsedQuestion[] = [];

    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        if (!data) {
          errors.push("❌ PDF faylini o'qib bo'lmadi (bo'sh ma'lumot).");
          resolve({ questions, errors });
          return;
        }

        const pdfData = await pdf(data as ArrayBuffer);
        const lines = pdfData.text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        let currentQuestion: ParsedQuestion | undefined;

        lines.forEach((line) => {
          const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
          if (questionMatch) {
            if (currentQuestion && currentQuestion.options.length === 4) {
              questions.push(currentQuestion);
            }
            currentQuestion = {
              id: `q-${questions.length + 1}`,
              text: questionMatch[2],
              options: [],
              correctAnswer: 0
            };
            return;
          }

          const optionMatch = line.match(/^([A-D])\.\s*(.+)/);
          if (optionMatch && currentQuestion) {
            if (currentQuestion.options.length < 4) {
              currentQuestion.options.push(optionMatch[2]);
              return;
            }
          }

          if (currentQuestion) {
            const correctMatch = line.match(/Correct:\s*([A-D])/i);
            if (correctMatch) {
              currentQuestion.correctAnswer = ["A", "B", "C", "D"].indexOf(correctMatch[1].toUpperCase());
            }
          }
        });

        if (currentQuestion && currentQuestion.options.length === 4) {
          questions.push(currentQuestion);
        }

        if (!questions.length) {
          errors.push("❌ PDF formatidan savollarni aniqlab bo'lmadi. Iltimos, qo'lda tekshiring.");
        }
      } catch (error) {
        errors.push(`❌ PDF parsing failed: ${(error as Error).message}`);
      }

      resolve({ questions, errors });
    };

    reader.onerror = () => {
      errors.push("❌ PDF faylini o'qishda xatolik.");
      resolve({ questions, errors });
    };

    reader.readAsArrayBuffer(file);
  });
