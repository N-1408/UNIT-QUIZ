# UNIT-QUIZ Monorepo

CEFR Up Mini Test loyihasi uchun 1-bosqich skeleti tayyor. Telegram Mini App (frontend) va grammY webhook (backend) yagona monorepo ichida joylashgan.

## Holat

- 1-bosqich yakun: skeleton tayyor; keyingi bosqich — Supabase + deploy.
- Hozircha local o‘rnatish shart emas. Keyingi bosqich: Vercel (web), Render (api) yoki Supabase Edge (webhook), Supabase (DB).
- Env kalitlarni faqat hosting panelida to‘ldiramiz.

## Tuzilma

```
/
├─ apps/web      # Telegram Mini App (React + Vite + Tailwind)
├─ apps/api      # Node.js (Express + grammY) webhook server
├─ db            # Supabase jadval stublari
└─ docs          # Texnik topshiriq va import qo‘llanma
```

## Skriptlar

- `npm run format` – Prettier bilan kodni formatlash.
- `npm run lint` – Hozircha `skip`.
- Frontend: `apps/web` ichida `npm run dev|build|preview`.
- Backend: `apps/api` ichida `npm run dev|build|start`.

## Keyingi qadamlar

1. Supabase sxemasini to‘ldirish va real ma’lumot bilan sinash.
2. Deploy pipeline: Vercel (frontend) + Render/Supabase Edge Functions (backend).
3. Telegram initData verify va autentikatsiya jarayonini ishlab chiqish.
