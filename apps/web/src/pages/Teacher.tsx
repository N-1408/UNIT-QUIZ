function Teacher() {
  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">O‘qituvchi paneli</h2>
        <p className="mt-2 text-sm text-slate-500">
          Bu sahifa PDF va Excel fayllarini import qilish uchun tayyorlanmoqda. Hozircha tugmalar demo
          tarzida ishlaydi.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="flex-1 rounded-xl border border-primary bg-primary/90 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary"
          disabled
        >
          Upload PDF
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-primary shadow-sm transition hover:border-primary/50 hover:text-primary"
          disabled
        >
          Upload Excel
        </button>
      </div>
      <p className="text-xs text-slate-400">
        Grafik interfeys INTER-NATION.UZ brendinga moslab yangilanadi. Hozircha tugmalar faqat maket.
      </p>
    </section>
  );
}

export default Teacher;
