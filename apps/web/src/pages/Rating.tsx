import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../App';

interface RatingItem {
  id: string;
  name: string;
  groupTitle: string;
  bestFirstScore: number;
}

const baseStudents: RatingItem[] = [
  { id: 'dilnoza', name: 'Dilnoza S.', groupTitle: 'IELTS-4', bestFirstScore: 92 },
  { id: 'azizbek', name: 'Azizbek K.', groupTitle: 'B2-Mentor', bestFirstScore: 88 },
  { id: 'sohibjon', name: 'Sohibjon O.', groupTitle: 'Upper-1', bestFirstScore: 84 },
  { id: 'gulnoza', name: 'Gulnoza T.', groupTitle: 'B1-Express', bestFirstScore: 79 }
];

const groupDictionary: Record<string, string> = {
  'ielts-4': 'IELTS-4',
  'upper-1': 'Upper-1',
  'b1-express': 'B1-Express'
};

export default function RatingPage() {
  const { user } = useOutletContext<AppOutletContext>();

  const ranking = useMemo(() => {
    const list: RatingItem[] = [...baseStudents];
    if (user) {
      const existingIndex = list.findIndex((item) => item.id === user.id);
      const groupName = groupDictionary[user.groupId] ?? 'Demo';
      const userEntry: RatingItem = {
        id: user.id,
        name: user.fullName,
        groupTitle: groupName,
        bestFirstScore: 82
      };

      if (existingIndex >= 0) {
        list.splice(existingIndex, 1, userEntry);
      } else {
        list.push(userEntry);
      }
    }

    return list.sort((a, b) => b.bestFirstScore - a.bestFirstScore);
  }, [user]);

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reyting</h1>
        <p className="mt-1 text-sm text-white/50">
          Reyting faqat BIRINCHI urinishdagi ball bilan hisoblanadi. Keyingi urinishlar faqat tayyorgarlik
          uchun.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {ranking.map((item, index) => {
          const isCurrent = item.id === user?.id;
          return (
            <div
              key={item.id}
              className={[
                'flex items-center justify-between rounded-2xl border px-4 py-3 transition',
                'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]',
                isCurrent ? 'ring-2 ring-brand-yellow ring-offset-2 ring-offset-[#0b0b0b] bg-brand-yellow/5' : ''
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white/60">{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-white/50">{item.groupTitle}</p>
                </div>
              </div>
              <span className="text-base font-semibold text-brand-yellow">{item.bestFirstScore}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
