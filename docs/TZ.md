# TEXNIK TOPSHIRIQ — 1-BOSQICH

## Maqsad

- Telegram Mini App (React + Vite + Tailwind) skeleti.
- Node.js (Express + grammY) webhook API skeleti.
- Supabase integratsiyasi va production deploy keyingi bosqichda.

## Asosiy vazifalar

1. Web App sahifalari:
   - Home: Active Tests kartasi, Teacher Panel havolasi.
   - Teacher: PDF/Excel import tugmalari (stub).
   - TestRunner: 10 daqiqalik taymer UI, mock submit.
2. Backend endpointlari:
   - `GET /health` — servis holatini tekshirish.
   - `POST /telegram/webhook` — grammY handler, `/start` uchun WebApp tugmasi.
   - `POST /auth/telegram` — initData verify mock.
   - `GET /tests`, `POST /submissions` — mock ma’lumotlar.
3. Yakuniy natija:
   - Monorepo tuzilmasi, konfiguratsiya fayllari, dokumentatsiya skleti.
   - GitHub repoga push qilingan birinchi commit.

## Cheklovlar

- Mahalliy ishga tushirish majburiy emas.
- Supabase, hosting va haqiqiy initData verify keyingi iteratsiyaga qoldiriladi.
