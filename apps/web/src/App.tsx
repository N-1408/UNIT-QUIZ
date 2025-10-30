import { useState } from 'react';
import Home from './pages/Home';
import Teacher from './pages/Teacher';
import TestRunner from './pages/TestRunner';
import Header from './components/Header';

type PageKey = 'home' | 'teacher' | 'runner';

const pages: Record<PageKey, { label: string }> = {
  home: { label: 'Talaba' },
  teacher: { label: 'O‘qituvchi' },
  runner: { label: 'Test' }
};

function App() {
  const [activePage, setActivePage] = useState<PageKey>('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-10 pt-6">
        <nav className="grid grid-cols-3 gap-3">
          {Object.entries(pages).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setActivePage(key as PageKey)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                activePage === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40'
              }`}
            >
              {meta.label}
            </button>
          ))}
        </nav>
        {activePage === 'home' && <Home onSelect={() => setActivePage('runner')} />}
        {activePage === 'teacher' && <Teacher />}
        {activePage === 'runner' && <TestRunner onBack={() => setActivePage('home')} />}
      </main>
    </div>
  );
}

export default App;
