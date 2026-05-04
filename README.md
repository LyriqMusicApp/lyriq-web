# Lyriq — Frontend

Educational AI song generator for UK primary schools and SEN settings.

## Local development

```bash
npm install
cp .env.example .env.local   # already done — no changes needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://lyriq-backend-production-bb5b.up.railway.app`
4. Deploy — done

## Environment variables

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL on Railway |

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Zustand (auth + player state)
- TanStack Query (server state)
- react-hook-form + zod (forms)
- sonner (toasts)
