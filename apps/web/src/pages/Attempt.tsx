import { AttemptScreen } from "@/components/exams/AttemptScreen";

const MOCK_QUESTIONS = [
  {
    id: 1,
    text: "Audio matn asosida to'g'ri javobni tanlang:",
    options: [
      { id: 1, text: "Variant A" },
      { id: 2, text: "Variant B" },
      { id: 3, text: "Variant C" },
      { id: 4, text: "Variant D" }
    ]
  }
];

export const AttemptPage = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold text-text-primary">Boshlashga tayyormisiz?</h2>
      <p className="text-sm text-text-secondary">
        Quyi savollarni ohista ko‘rib chiqing, javobni tanlaganda tugmalar yengil tebranar.
      </p>
    </div>
    <AttemptScreen questions={MOCK_QUESTIONS} onSubmit={() => console.log("submit attempt")} />
  </div>
);
