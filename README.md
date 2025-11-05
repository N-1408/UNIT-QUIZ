# Nova LC - UNIT QUIZ

Nova LC o'quvchilari uchun yaratilgan yengil va tezkor Telegram Mini App. Monorepo ikkita asosiy bo'limdan iborat:

- `apps/web`: React + Vite asosidagi Nova LC brendli Telegram WebApp.
- `apps/api`: Express + grammY webhook serveri va kontakt orqali avtorizatsiya.

## Asosiy imkoniyatlar

- **Send Contact login**: botdagi `/start` buyrug'idan so'ng foydalanuvchi telefon raqamini yuboradi va bir marta ro'yxatdan o'tadi.
- **Foydalanuvchi bazasi**: `users.json` fayli `telegram_id`, ism, username va telefon raqamini saqlaydi.
- **Telegram WebApp integratsiyasi**: UI foydalanuvchini faqat Telegram ID orqali taniydi, header'da ism va avatar ko'rsatiladi.
- **Nova LC dizayni**: #FF5F00 → #FF7B33 gradient tugmalar, Inter / SF Pro Rounded shriftlari, yumaloq burchaklar va soft soya.

## Tuzilma

```
/
├─ apps/
│  ├─ api/   # Express webhook + grammY bot
│  └─ web/   # Telegram WebApp (React)
├─ db/       # users.json fayli shu yerda saqlanadi
└─ docs/     # Qo'shimcha hujjatlar
```

## Muhit o'zgaruvchilari

.env namunasi `.env.example` faylida:

```
VITE_API_URL=http://localhost:8787
BOT_TOKEN=__PUT_TELEGRAM_BOT_TOKEN_HERE__
APP_ORIGIN=https://nova-lc-unit-quiz.vercel.app
DATABASE_URL=./db/users.json
PORT=8787
```

> `DATABASE_URL` bo'sh qoldirilsa, backend avtomatik ravishda `db/users.json` faylini yaratadi.

## Ishga tushirish

1. **Backend** (`apps/api`):
   ```bash
   npm install
   npm run dev
   ```
   `/telegram/webhook` endpoint'ini HTTPS orqali Telegram botga ulang (masalan, ngrok yoki Render).

2. **Frontend** (`apps/web`):
   ```bash
   npm install
   npm run dev
   ```
   Lokal Vite serverini Telegram WebApp sifatida ishlatish uchun `https://` tunnel tavsiya qilinadi.

## Autentikatsiya oqimi

1. Foydalanuvchi botda `/start` yuboradi.
2. Agar foydalanuvchi bazada bo'lmasa, bot `Raqamni yuborish (Send Contact)` tugmasini ko'rsatadi.
3. Kontakt yuborilgach:
   - backend `users` fayliga foydalanuvchi ma'lumotlarini yozadi;
   - bot `Ilovani ochish` WebApp tugmasini yuboradi.
4. WebApp ochilganda `Telegram.WebApp.initDataUnsafe.user.id` orqali foydalanuvchi aniqlanadi va `/api/users/:id` dan ma'lumot olinadi.

## Keyingi qadamlar

- Testlar va reyting API larini real ma'lumotlar bilan bog'lash.
- Render/Vercel deployment jarayonini yakunlash.
- Nova LC uchun analitika va monitoring qo'shish.
