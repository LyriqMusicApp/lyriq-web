# 05 — Pages Specification

Every route the app needs, with what's on each page.

## Public routes (no auth)

### `/` — Landing page

Simple. Marketing content can be added later. For v1, just:
- Logo + tagline
- One-line description
- Big "Sign in" / "Get started" buttons
- Maybe a screenshot or animated GIF

This is the lowest priority page. Get the app working first.

### `/login`

- Email + password
- "Sign in" button (primary)
- "Forgot password" link (links to mailto: for now — proper flow later)
- "Don't have an account? Register" link
- Error message inline on failed login

On successful login: store token, redirect to `/create`

### `/register`

- Email
- Password (with strength indicator? optional)
- Confirm password
- Display name
- School name (optional? — required if not "Home" type)
- School type dropdown: Primary, Secondary, SEN, Home, Other
- Country (default GB)
- "Create account" button
- "Already have an account? Sign in" link

On successful register: store token, redirect to `/create`

---

## Authenticated routes

If hitting any of these without auth, redirect to `/login`.

### `/create` — Song generation page (THIS IS THE MOST IMPORTANT PAGE)

The hero of the app. Should feel inviting, not overwhelming.

**Layout:**
- Page heading: "Create a song"
- Subtitle: brief explainer ("Tell us what to write about and we'll generate an educational song.")
- Form:
  - **Topic** — large textarea, placeholder shows good example: *"A song about the water cycle for Year 3. Include evaporation and condensation. Keep it simple for SEN learners."*
  - **Age range** — dropdown: 3–5 (Early Years), 6–9 (KS1), 10–13 (KS2)
  - **Genre** — dropdown: Pop, Rock, Rap, Country, Folk, Chant, Lullaby
  - **Tone** — dropdown: Happy, Energetic, Calm, Encouraging, Silly, Peaceful
  - (Advanced collapsible) — Subject, Curriculum area, Keywords
- **Generate button** — big, primary, full width on mobile

**While generating:**
- Form replaced/disabled
- Animated progress display
- Reassuring messaging ("Writing lyrics…" → "Composing melody…" → "Recording vocals…")
- Don't let user navigate away accidentally — confirm dialog if they try

**After generation:**
- Smoothly transitions to song display view (or redirects to `/song/[id]`)
- Audio player visible
- Lyrics displayed
- Action buttons: Save to my library, Share to library, Download, Generate another

**School usage indicator** — small text somewhere on the page like "5 of 100 generations used this month"

### `/library` — Public library browse

**Layout:**
- Top: search bar (full width, prominent), filter chips below
- Filter chips: Age range, Genre, Subject, Sort by
- Empty state if no songs
- Otherwise: grid of SongCards (3 across on desktop, 2 on tablet, 1 on mobile)
- Pagination at the bottom (or "Load more" button)

**Each SongCard shows:**
- Title
- Creator name
- Age range pill
- Genre pill
- Star rating (if any)
- Mini audio preview button (plays the 30s preview without leaving the page)
- Click anywhere on the card → opens `/song/[id]`

### `/library/search?q=...`

Search results. Same layout as `/library`. Shows what was searched. "No results" empty state.

### `/my-songs` — User's own songs

Same layout as library, but filtered to current user's creations.

Each card additionally shows:
- "Public" or "Private" indicator
- Quick actions: Edit, Share/Unshare, Delete

### `/song/[id]` — Song detail page (the playback page)

This is where teachers spend the most time once a song is loaded. Has to be polished.

**Layout (desktop):**
```
┌──────────────────────────────────────────────────┐
│  ← Back                                          │
│                                                  │
│  Song Title (h1)                                 │
│  by Creator Name · Year 3 · Science · Rock       │
│                                                  │
│  ┌────────────────────┬────────────────────────┐│
│  │  [Audio Player]    │   [Actions panel]      ││
│  │  ┌─────────────┐   │   ★ Rate               ││
│  │  │ Now Playing │   │   ❤ Like               ││
│  │  └─────────────┘   │   ⬇ Download           ││
│  │  Big play button   │   📁 Add to collection ││
│  │  Scrubber          │   🔗 Share link        ││
│  │  Volume / Speed    │   🖥 Projector mode    ││
│  └────────────────────┴────────────────────────┘│
│                                                  │
│  Lyrics                                          │
│  ┌──────────────────────────────────────────────┐│
│  │ [Verse 1]                                    ││
│  │ The sun heats up the ocean blue              ││
│  │ Water turns to vapour too                    ││
│  │ ...                                          ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  Comments (collapsible)                          │
└──────────────────────────────────────────────────┘
```

**Projector mode** = full-screen takeover with:
- Black or dark purple background
- Title at top in big text
- Lyrics scrolling, current line highlighted
- Minimal player controls bottom-centre
- Esc to exit

If the song is **private** (the user's own draft), show:
- "Share to Library" button (opens metadata dialog)
- "Edit" button (in-place title edit, etc.)
- "Delete" button

If the song is **public**:
- Show download count, like count, average rating
- "Add to my library" / "Download" button
- Comments section

### `/profile` — Current user's profile

- Display name (editable)
- Bio (editable)
- School name
- Songs created count, songs shared count
- Reputation score
- Badges (placeholder for now)
- Logout button

### `/settings` — Optional, can defer

- Change password
- Notification preferences
- Delete account

---

## Component routes (modals/dialogs, not actual pages)

These open as modal overlays:

### Share to Library dialog

When sharing a song, show:
- Title (pre-filled, editable)
- Subject (optional)
- Curriculum area (optional)
- Keywords (comma-separated input)
- "Share publicly" / "Cancel" buttons

### Confirm Delete dialog

Standard confirm dialog with red destructive button.

---

## Navigation patterns

- **Logged in:** Top nav with Logo, Create, Library, My Songs, Profile dropdown
- **Logged out:** Top nav with Logo, Login, Register
- **Mobile:** Hamburger menu

## Persistent UI elements

- **Audio player at the bottom** — Spotify-style — when a song is playing it persists across page navigation. So a teacher can browse the library, click play on a song, then navigate to `/my-songs` and the song keeps playing.

This is a nice-to-have for v1. If it adds too much complexity, the `/song/[id]` page can be the only place audio plays. Decide based on how clean it can be.

## Keyboard shortcuts (nice to have)

- `Cmd/Ctrl + K` — open search
- `Space` — play/pause when audio is playing
- `Esc` — exit projector mode / close modal

---

## What pages NOT to build for v1

- Pricing page
- Marketing pages
- Help / docs
- Admin dashboard
- Stripe checkout
- Email verification flow
- Password reset flow (mailto: link is fine)
