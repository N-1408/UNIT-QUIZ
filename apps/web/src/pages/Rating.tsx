import { useMemo } from 'react';

interface RatingItem {
  id: string;
  name: string;
  group: string;
  score: number;
}

const data: RatingItem[] = [
  { id: 'dilnoza', name: 'Dilnoza S.', group: 'IELTS-4', score: 92 },
  { id: 'azizbek', name: 'Azizbek K.', group: 'B2-Mentor', score: 88 },
  { id: 'sohibjon', name: 'Sohibjon O.', group: 'Upper-1', score: 84 },
  { id: 'you', name: 'Siz (Demo)', group: 'Upper-1', score: 82 },
  { id: 'gulnoza', name: 'Gulnoza T.', group: 'B1-Express', score: 79 }
];

export default function RatingPage() {
  const ranking = useMemo(() => [...data].sort((a, b) => b.score - a.score), []);
  const currentId = 'you';

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reyting</h1>
        <p className="mt-1 text-sm text-white/50">
          Reyting faqat BIRINCHI urinishdagi ball bilan hisoblanadi.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {ranking.map((item, index) => {
          const isCurrent = item.id === currentId;
          return (
            <div
              key={item.id}
              className={[
                'flex items-center justify-between rounded-2xl border px-4 py-3 transition',
                'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]',
                isCurrent ? 'ring-2 ring-brand-yellow ring-offset-2 ring-offset-[#0b0b0b]' : ''
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white/60">{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-white/50">{item.group}</p>
                </div>
              </div>
              <span className="text-base font-semibold text-brand-yellow">{item.score}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
