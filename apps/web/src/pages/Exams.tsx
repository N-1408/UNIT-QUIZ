import { useState } from "react";
import { ExamList } from "@/components/exams/ExamList";
import type { ExamSummary } from "@/components/exams/ExamCard";

const MOCK_DATA: Record<"upcoming" | "open" | "closed", ExamSummary[]> = {
  upcoming: [
    {
      id: 3,
      title: "Speaking Jam Session",
      startsAt: new Date(Date.now() + 1000 * 60 * 120),
      durationMinutes: 25,
      status: "upcoming"
    }
  ],
  open: [
    {
      id: 4,
      title: "Grammar Clinic",
      startsAt: null,
      durationMinutes: 35,
      status: "open"
    }
  ],
  closed: []
};

const FILTERS = [
  { id: "upcoming", label: "UPCOMING" },
  { id: "open", label: "OPEN" },
  { id: "closed", label: "CLOSED" }
] as const;

export const ExamsPage = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]["id"]>("open");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-brand text-brand-ink" : "bg-surface-2 text-muted"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <ExamList items={MOCK_DATA[activeFilter]} />
    </div>
  );
};
