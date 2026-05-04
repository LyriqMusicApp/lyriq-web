# 04 — Tech Stack

## What I want you to use

I'm not a developer. Pick what's standard, well-supported, and easy for a non-technical person to keep running. My suggestions below — **push back if there's a better option for this specific use case.**

### Frontend framework

**Next.js 15 (App Router) + React 19 + TypeScript**

Why:
- Server-side rendering out of the box (good for SEO when we eventually have a marketing page)
- Easy deployment on Vercel (free tier, zero config)
- Industry standard — easy to hire help later if needed
- TypeScript catches bugs early

### Styling

**Tailwind CSS v4** + **shadcn/ui** for components

Why:
- shadcn gives polished, accessible primitives I can copy and own
- Tailwind makes the design system enforceable
- Don't reinvent buttons and modals

### State management

Whatever feels right for the scope:
- **TanStack Query (React Query)** for server state (API calls)
- **Zustand** or React Context for client state (audio player, theme, modal)
- No Redux, no MobX

### HTTP client

`fetch` is fine. Or `ky` if you want a slightly nicer API. Avoid axios bloat.

### Audio player

`react-h5-audio-player` is fine if you want a quick win. Or build custom on top of native `<audio>`. Custom is probably better given how central the audio experience is.

### Forms

`react-hook-form` + `zod` for validation. Standard, works well.

### Auth

For v1: store the JWT in **httpOnly cookie** (set via Next.js API route) or **localStorage** if simpler. The backend gives us tokens, we just need to keep them safe. Don't roll your own auth.

If httpOnly cookies are a faff with the existing backend setup, localStorage is acceptable for MVP — just be aware of XSS implications and don't store anything sensitive beyond the access token.

### Deployment

**Vercel** — free, integrates with GitHub, auto-deploys on push. Perfect for Next.js.

Eventually: custom domain (`lyriq.app` or similar — domain not bought yet).

### Folder structure (suggestion — feel free to improve)

```
/src
  /app
    /(auth)
      /login
      /register
    /(dashboard)
      /create        ← song generation
      /library       ← public browse
      /my-songs      ← user's own
      /song/[id]     ← song detail page (with player + lyrics)
    /api             ← Next API routes (proxy if needed)
    layout.tsx
    page.tsx         ← landing/marketing page (simple for now)
  /components
    /ui              ← shadcn components
    /lyriq           ← Lyriq-specific components (AudioPlayer, LyricsDisplay, SongCard, etc.)
  /lib
    /api             ← API client functions
    /hooks
    /utils
  /types             ← shared TS types matching the backend models
```

### Code style preferences

- TypeScript strict mode on
- Prettier + ESLint configured
- No magic strings — enums for genres, age ranges, etc. (mirror the backend enums)
- Keep components under ~200 lines; split when bigger
- Server Components for data fetching where possible
- Client Components only when needed (interactivity, hooks)

### Don't include in v1

- Internationalisation (i18n) — backend supports many languages but UI is English-only for now
- Stripe / payments
- Email sending
- Analytics (we'll add PostHog later)
- Service workers / PWA
- Tests (yes really — get it working first, add tests after launch)

## Local development

The dev experience needs to be DEAD simple. I'm going to clone the repo and want to:

1. `pnpm install`
2. Copy `.env.example` to `.env.local`, fill in any keys needed (probably just `NEXT_PUBLIC_API_URL`)
3. `pnpm dev`
4. Open localhost:3000

That's it. Anything more complex than that and I'll get stuck.

## Environment variables needed

```
NEXT_PUBLIC_API_URL=https://lyriq-backend-production-bb5b.up.railway.app
```

That's literally it for v1. Auth happens via the backend; no Supabase keys needed in the frontend.

## What deployment looks like

1. Push to GitHub
2. Vercel auto-deploys
3. Set the `NEXT_PUBLIC_API_URL` env var in Vercel project settings
4. Done

Show me clear setup instructions in the README that I (a non-dev) can actually follow.
