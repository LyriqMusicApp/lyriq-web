# Master Prompt for Claude Code

Copy and paste the prompt below into Claude Code (in your project folder, after you've placed all the spec files there).

---

## THE PROMPT

I'm building a web app called **Lyriq** — an educational AI music tool for UK primary schools and SEN settings. Teachers enter a topic, genre, and age range; the backend generates an educational song with AI-generated lyrics (Claude API) and audio (ElevenLabs Music API). Teachers can save songs, share them publicly, and browse a library of songs other teachers have made.

The backend is **already built and deployed** on Railway. My job — and yours — is to build the **web frontend** that talks to it.

I have an existing FlutterFlow proof-of-concept that proves the backend works end-to-end, but FlutterFlow is too limited for a real product. I want a proper, polished web app teachers will actually want to use in classrooms.

## What I want you to do

Read all the spec files in this repo before writing any code:

1. `01-PRODUCT-SPEC.md` — what Lyriq is, who it's for, what success looks like
2. `02-API-SPEC.md` — every backend endpoint with example requests/responses
3. `03-DESIGN-SPEC.md` — the visual design and UX principles
4. `04-TECH-STACK.md` — the technologies I want you to use and why
5. `05-PAGES-SPEC.md` — every page/route the app needs and what's on it
6. `06-USER-FLOWS.md` — how teachers move through the app
7. `07-CLASSROOM-CONTEXT.md` — important constraints from teachers using this in real classrooms

Then **before writing a single line of code**, give me:

1. A high-level plan of how you'll build it (file structure, key components, state management approach)
2. Any questions or clarifications you need from me
3. Anything in the specs that seems wrong, contradictory, or missing
4. Your suggested order of implementation (what to build first, second, third)

Once I've reviewed and confirmed your plan, build it incrementally. After each major chunk, show me what's working and let me test it before continuing.

## Ground rules

- **I'm non-technical.** Explain things in plain English, not engineer-speak.
- **I want to actually run this locally.** Make sure setup instructions are dead simple.
- **Polish matters.** This needs to feel like a real product, not a demo.
- **Don't gold-plate.** Build the MVP first, polish after.
- **Ask me questions** when you're unsure rather than assuming.

Let's build something teachers actually want to use.
