# Getting Started with Claude Code — Lyriq Frontend

This is your handoff package for rebuilding the Lyriq web frontend with Claude Code.

## What's in this folder

```
00-MASTER-PROMPT.md      ← The prompt you paste into Claude Code to kick things off
01-PRODUCT-SPEC.md       ← What Lyriq is and who it's for
02-API-SPEC.md           ← Every backend endpoint with examples
03-DESIGN-SPEC.md        ← Visual design and UX principles
04-TECH-STACK.md         ← What technologies to use
05-PAGES-SPEC.md         ← Every page in the app
06-USER-FLOWS.md         ← How teachers move through the app
07-CLASSROOM-CONTEXT.md  ← Important real-world constraints
README.md                ← This file
```

## Step-by-step: how to use this

### Step 1: Install Claude Code

If you haven't already, install Claude Code:
- Visit Anthropic's documentation site for the latest install instructions
- Or run `npm install -g @anthropic-ai/claude-code` in your terminal (requires Node.js)
- Sign in with your Claude account

### Step 2: Create a new folder for the project

```bash
mkdir lyriq-web
cd lyriq-web
git init
```

### Step 3: Drop these files into the folder

Copy all 8 files (00–07 + this README) into the `lyriq-web` folder. Claude Code will read them.

### Step 4: Open Claude Code

```bash
claude
```

(Or whatever the launch command is for your version.)

### Step 5: Paste the master prompt

Open `00-MASTER-PROMPT.md`, copy the prompt section, paste it into Claude Code.

### Step 6: Let Claude plan first

Claude will read all the spec files and come back with:
- A high-level plan
- Questions
- Suggested order of work

**Read the plan carefully.** This is your chance to push back, add details, or change direction. Don't skip this — it shapes everything that follows.

### Step 7: Approve or adjust

Tell Claude to proceed, or ask follow-up questions, or share more context.

### Step 8: Build incrementally

Claude Code should build in phases:
- Phase 1: Project setup, auth, basic layout
- Phase 2: Song generation page
- Phase 3: Song detail / playback page
- Phase 4: Library browse + search
- Phase 5: My Songs + sharing
- Phase 6: Polish, deploy

After each phase, run it locally and test before moving on.

### Step 9: Deploy to Vercel

Once you're happy with the local version:
- Push to GitHub
- Connect the GitHub repo to Vercel (free)
- Set the env var: `NEXT_PUBLIC_API_URL=https://lyriq-backend-production-bb5b.up.railway.app`
- Vercel auto-deploys

## Tips for working with Claude Code

- **It will ask you questions.** Answer them in plain English.
- **Tell it when something looks wrong.** It can iterate.
- **Don't be afraid to start over.** If a chunk of code is going sideways, ask Claude to throw it out and rethink.
- **Ask for explanations.** "Why did you choose Zustand here instead of Context?" Claude will explain.
- **Run things locally as you go.** Don't let it build for hours without testing.

## What to expect

A frontend like this would normally take a freelance developer 2–4 weeks to build properly.

With Claude Code, expect:
- 1–2 evenings to get to a usable MVP
- Another evening for polish
- Ongoing iterations as you find bugs and want changes

You won't have to write code yourself — but you WILL need to:
- Test things and report what works/doesn't
- Make product decisions Claude asks about
- Push back when something doesn't feel right

## When to ask for help

If you get truly stuck:
- Bring the whole conversation back to me (Claude in chat) for advice
- Or ask Claude Code itself "I'm stuck because of X — what should I do?"
- Or post on r/ClaudeAI / Anthropic's Discord

## Final note

This handoff package is comprehensive but not exhaustive. There WILL be questions Claude Code raises that aren't covered here. That's fine — answer them based on your gut and what teachers would want. You know this product better than anyone.

Good luck — go build something teachers will actually love.
