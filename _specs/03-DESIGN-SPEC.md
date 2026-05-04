# 03 — Design Specification

## Design philosophy

Modern, calm, friendly, professional. Think **Linear** + **Notion** + a dash of **BBC Bitesize** warmth.

NOT: Cluttered, cartoonish, "kid-coded", chrome-heavy, dark mode by default, anything that screams "ed-tech".

## Brand colours

Suggest these (Claude Code can refine):

```
--lyriq-purple: #5B47FB    /* primary brand colour, like the FlutterFlow proof of concept */
--lyriq-purple-light: #EEEBFF
--lyriq-purple-dark: #3D2EE3

--lyriq-coral: #FF6B6B      /* accent — for share/like buttons etc */
--lyriq-mint: #4ECDC4       /* success states */

/* Neutrals */
--bg: #FAFBFC
--surface: #FFFFFF
--border: #E4E7EC
--text-primary: #101828
--text-secondary: #475467
--text-muted: #98A2B3

/* Semantic */
--success: #10B981
--warning: #F59E0B
--error: #EF4444
```

A subtle gradient on the primary CTA (purple → slightly different purple) is a nice touch.

## Typography

- Headings: Inter or similar geometric sans-serif (system stack also fine)
- Body: Same as headings
- **Lyrics display: a slightly more characterful font** — something like Crimson Pro, Lora, or even a chunky display font. Lyrics need to feel different from UI text. They're the content.

Sizes (rough guidance):
- Page title (h1): 32px
- Section heading (h2): 24px
- Card title: 18px
- Body: 16px
- Caption: 14px
- **Lyrics body: 20px minimum** — bigger because they get projected
- **Lyrics "big mode": 48px** — for projector display

## Layout

### Top nav (web)

Logo on the left. Nav links in the middle or right: **Create**, **My Songs**, **Library**. Profile dropdown on the far right with logout.

The Create link should be the slightly punchier item — it's the main thing teachers come here to do.

### Page width

Max content width: ~1200px. Centre on big screens. Don't let lines stretch too wide.

### Spacing

Generous. Don't cram. White space is a feature.

## Components needed

### Buttons

- **Primary** — purple background, white text, subtle gradient, shadow on hover
- **Secondary** — white background, purple text, purple border
- **Ghost** — no border, transparent, used for tertiary actions
- **Destructive** — red, for delete actions

### Inputs

- Text field with floating label, purple focus ring
- Textarea (for the topic field, multi-line — teachers write detailed prompts)
- Dropdown/select — custom styled, not browser default
- Form validation messages below the field in red

### Cards

Used for songs in the library and "My Songs". Each card shows:
- Title
- Creator name (small, secondary)
- Genre + age range pills
- Star rating (if any)
- Play button
- "Save" or "Download" button

Hover state: subtle lift (translateY -2px), slight shadow increase. Click to open detail.

### Audio player

This is one of the most important UI elements. Spec:
- Play/pause button (big, central)
- Scrub bar with current time / duration
- Volume control
- Optional: speed control (0.75x, 1x, 1.25x — useful for SEN classrooms)
- Optional: download button

If you can do **lyrics highlighting in time with the audio**, that's a killer feature — but only if the audio API gives us word/line-level timestamps. ElevenLabs Music API may not. Default to scrolling highlight or just static lyrics if not.

### Lyrics display

Two modes:

1. **Normal mode** — within the page layout, ~20px text
2. **Projector mode** — full-screen, dark background, huge text (48px+), section markers like `[Verse 1]` styled distinctly. A button on the player to toggle. Press Esc to exit. This is THE feature for classroom use.

### Loading states

Generation takes 30–60 seconds. The loading state should:
- Show a clear progress indication (animated, not just a spinner)
- Reassure the user it's working ("Generating your song… this takes about 30 seconds")
- Optionally: show what stage we're at ("Writing lyrics…" → "Recording vocals…" → "Mixing…")

NOTE: The backend doesn't actually report stage progress — but you can fake the messaging on a timer to make the wait feel intentional rather than broken.

### Empty states

Library has no songs yet? My Songs page is empty? Show a friendly empty state with an illustration or icon and a clear CTA ("Generate your first song").

### Error states

Generation failed? Show a friendly error with retry button. Don't show stack traces.

### Toasts / snackbars

For confirmations: "Song shared to library", "Saved to your library", "Copied to clipboard". Top-right or bottom-centre, dismiss after 3s.

## Iconography

Use **Lucide** icons (open source, clean, modern). Avoid emoji for UI.

## Mobile considerations

- Mobile is bonus, not core
- But: don't completely break on a phone
- Generate page should stack vertically on mobile
- Library cards become single-column
- Top nav becomes a hamburger menu

Responsive breakpoints:
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: > 1024px

## Accessibility

- Proper semantic HTML (real `<button>` elements, `<label>` for inputs, etc.)
- Keyboard navigation works everywhere
- Focus states visible
- Colour contrast WCAG AA minimum
- Audio player has keyboard controls (space = play/pause)
- Screen reader friendly

## Inspiration / references

Show me you've understood the brief if you can take cues from:
- **Linear** — keyboard shortcuts, clean typography, command palette feel
- **Spotify** — audio player UX, library browsing, "now playing" persistence
- **Notion** — typography, calm spacing, friendly tone in copy
- **Vercel dashboard** — clean modern web app aesthetic
- **BBC Bitesize** — warm but trustworthy ed feel

NOT references:
- Class Dojo (too kid-coded)
- ClassChartsPlanItOnYourOwnNan (too admin-heavy / boring corporate)
- Anything mid-2010s ed-tech
