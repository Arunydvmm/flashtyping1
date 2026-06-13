# TypeFast — Typing Test Platform

A Next.js 14 + Tailwind + Supabase typing test platform with real-time WPM/accuracy
tracking, a personal dashboard, PDF certificates, and secure certificate emailing.

## 1. Local Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase, EmailJS, and (optional) Upstash credentials.

```bash
npm run dev
```

## 2. Supabase Setup

1. Create a project at https://supabase.com.
2. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
   This creates:
   - `profiles` table (auto-populated on signup via trigger)
   - `test_results` table with Row Level Security so users only see their own data
   - `daily_performance` view for efficient chart aggregation at scale
4. In **Authentication → Providers**, ensure Email is enabled. For development,
   you can disable "Confirm email" under **Authentication → Settings** so signup
   logs the user in immediately.

## 3. EmailJS Setup (Certificate Emails)

1. Create an account at https://www.emailjs.com.
2. Create an Email Service and an Email Template with variables:
   `to_email`, `user_name`, `wpm`, `accuracy`, `date`.
3. Copy the Service ID, Template ID, Public Key, and **Private Key** (under
   Account → API Keys) into `.env.local`. The private key is used **server-side
   only** in `/app/api/send-certificate/route.ts` — never expose it to the client.

## 4. Rate Limiting (Optional but Recommended)

1. Create a free Redis database at https://upstash.com.
2. Copy the REST URL and token into `UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN`.
3. This limits certificate emails to 3 per user per hour. If these env vars are
   not set, rate limiting is skipped (fine for local dev, **set in production**).

## 5. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or via the Vercel dashboard:

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add all variables from `.env.example` under **Project Settings → Environment
   Variables**.
4. Deploy.

## 6. Project Structure

See the inline comments in each file. Key entry points:

- `hooks/useTypingEngine.ts` — core character-by-character comparison engine
- `components/typing/TypingEngine.tsx` — typing test UI container
- `app/test/[mode]/page.tsx` — `/test/time` and `/test/long` pages
- `app/(dashboard)/dashboard/page.tsx` — analytics dashboard (server component)
- `app/api/send-certificate/route.ts` — secured email endpoint
- `supabase/schema.sql` — full DB schema + RLS policies

## 7. Notes

- The hidden `<input>` overlay in `TypingEngine.tsx` captures keystrokes while
  `TextDisplay.tsx` renders the colored, cursor-animated text.
- Long-format passages live in `lib/textGenerator.ts` — replace with a real
  content source (CMS/API) as needed.
- For production scale, switch the dashboard chart query to read from the
  `daily_performance` view instead of raw `test_results`.
