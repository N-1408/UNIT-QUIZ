# Nova LC - UNIT QUIZ

Nova LC oquvchilari uchun ishlab chiqilgan Telegram Mini App. Monorepo quyidagi paketlardan iborat:

- `apps/web`: React + TypeScript + Telegram Mini App SDK
- `apps/api`: Express + grammY webhook serveri

## Auth oqimi (Send Contact + Supabase)

1. Foydalanuvchi botga `/start` yuboradi.
2. Agar foydalanuvchi Supabase `users` jadvalida topilmasa, bot "Raqamni yuborish (Send Contact)" tugmasini korsatadi.
3. Foydalanuvchi kontakt yuboradi:
   - Telegram `user_id` Supabase `users.id` sifatida saqlanadi (`first_name`, `last_name`, `phone_number` maydonlari bilan).
   - Bot royxatdan otish tasdigini yuboradi va Mini App havolasini korsatadi.
4. Agar foydalanuvchi allaqachon mavjud bolsa, bot bevosita "Ilovani ochish" tugmasini qaytaradi.
5. Frontend WebApp ochilgach, Telegram WebApp kontekstdan `user.id` oladi va `/api/users/:id` orqali Supabase dagi malumotni oladi.

## Muhit ozgaruvchilari

`.env.example` fayli bazaviy sozlamalarni korsatadi:

```
VITE_API_URL=http://localhost:8787

BOT_TOKEN=__PUT_TELEGRAM_BOT_TOKEN_HERE__
APP_ORIGIN=https://unitquiz.vercel.app
ADMIN_CHANNEL_ID=
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=__PUT_SUPABASE_SERVICE_ROLE_KEY__
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
```

> Supabase service role key faqat backendda ishlatiladi. Frontend uchun kerak bolsa alohida anon key qoshish mumkin.

## Ishga tushirish

### Backend (Render uchun tayyor)

```
cd apps/api
npm install
npm run dev
```

- Webhook endpoint: `/telegram/webhook`
- Render da deploy qilishda env ozgaruvchilarini panelda korsating.

### Frontend (Vercel uchun tayyor)

```
cd apps/web
npm install
npm run dev
```

- `VITE_API_URL` ni Render API manziliga yonaltiring.
- Vercel da deploy qilganda build buyruqlari avtomatik (`npm run build`).

## GitHub Actions

`.github/workflows/deploy.yml` har bir pushda frontend va backend buildlarini tekshiradi. Vercel va Render autodeploy haqiqiy hisoblarga boglanadi (secrets orqali).

## Dizayn prinsiplari

- Brend nomi: **Nova LC**
- Asosiy rang: `#FF5F00` (gradient tugmalar `#FF5F00 -> #FF7B33`)
- Inter / SF Pro Rounded shriftlariga mos, yumaloq (rounded-xl) elementlar, minimal Telegram/Apple uslubi

## Keyingi qadamlarga oid eslatmalar

- Reyting/test API larini Supabase yoki boshqa manbaga boglash.
- Render va Vercel autodeploy uchun kerakli secrets (BOT_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY va boshqalar) ni GitHub repository secrets orqali ulash.
