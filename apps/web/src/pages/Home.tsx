import { useMemo } from 'react';
import { faker } from '@faker-js/faker';

interface HomeProps {
  onSelect: () => void;
}

const mockTests = [
  {
    id: 1,
    title: 'Unit 1 Quick Check',
    description: '10 ta savol • 10 daqiqa • Intermediate'
  }
];

function Home({ onSelect }: HomeProps) {
  const studentName = useMemo(() => faker.person.firstName(), []);

  return (
    <section className="flex flex-col gap-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Assalomu alaykum, {studentName}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Tez orada Supabase bilan haqiqiy ma’lumotlar yuklanadi. Hozircha demo kartalar.
        </p>
      </div>

      <div className="grid gap-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Active Tests</h3>
              <p className="mt-1 text-sm text-slate-500">
                1-bosqich: sinov uchun qo‘lda qo‘shilgan imtihonlar.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Beta
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {mockTests.map((test) => (
              <div
                key={test.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{test.title}</h4>
                  <p className="text-sm text-slate-500">{test.description}</p>
                </div>
                <button
                  onClick={onSelect}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
                >
                  Open Test
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Teacher Panel</h3>
          <p className="mt-1 text-sm text-slate-600">
            PDF yoki Excel import qilish uchun alohida panel. Hozircha demo, tez orada autentikatsiya
            qo‘shiladi.
          </p>
          <p className="mt-3 text-xs uppercase tracking-wide text-primary">Soon™</p>
        </article>
      </div>
    </section>
  );
}

export default Home;
