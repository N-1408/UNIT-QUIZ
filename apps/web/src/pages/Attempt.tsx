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
    <AttemptScreen questions={MOCK_QUESTIONS} onSubmit={() => console.log("submit attempt")} />
  </div>
);
