# 06 — User Flows

The most important journeys teachers will take through the app.

## Flow 1: First-time teacher generates and saves a song

The "wow moment" flow. This is what determines whether a teacher comes back.

1. Teacher lands on `/` (or `/login` from a marketing link)
2. Clicks "Get started" / "Register"
3. Fills out registration form, submits
4. Lands on `/create`
5. Sees the form, types a topic ("A song about the planets in our solar system for Year 4, fun and energetic")
6. Picks age range (10-13), genre (Pop), tone (Energetic)
7. Clicks "Generate"
8. Sees progress UI for ~30-60s (this is the make-or-break wait)
9. Page transitions to the song view — audio auto-loads, lyrics shown
10. Teacher clicks play, listens
11. Loves it. Clicks "Save" → toast confirms
12. Optionally clicks "Share to Library" → metadata dialog → submits → public

Critical moments:
- **Step 8 (waiting):** the progress UI must feel intentional, reassuring. If it feels broken, teacher closes the tab.
- **Step 9 (the reveal):** transition should feel polished, like a payoff. Audio shouldn't auto-play (autoplay policies break this anyway) — show a clear play button.
- **Step 11 (saving):** instant. If saving feels laggy or unclear, teacher won't trust the app with future songs.

## Flow 2: Returning teacher uses an existing song in class

The "actually using it" flow. Just as important as generation.

1. Teacher logs in (Monday morning, 8:30am, classroom about to start)
2. Goes to `/my-songs`
3. Finds the water cycle song they made yesterday
4. Clicks it → opens `/song/[id]`
5. Clicks "Projector mode"
6. Full-screen takeover with big lyrics
7. Hits play
8. Children sing along reading lyrics on the IWB
9. Song ends, teacher hits Esc, back to the song page

Critical:
- **Step 4-5:** must take 3 clicks max from login to playing. Speed matters — kids are watching, teacher is on the clock.
- **Projector mode must work flawlessly** on whatever browser the school uses (often outdated Chrome on a Windows laptop).
- **No hidden controls** — teacher might not have used projector mode before. Pause/skip must be obvious.

## Flow 3: Teacher discovers a song from another teacher

1. Teacher goes to `/library`
2. Sees grid of public songs
3. Filters by Age Range = 6-9, Subject = Maths
4. Scrolls through results
5. Finds "The Times Tables Adventure"
6. Clicks the mini-play to preview the first 30s
7. Likes it, clicks the card → `/song/[id]`
8. Clicks "Save to my library" → toast
9. Now in their `/my-songs`

Critical:
- **Mini-preview** is important — teachers won't commit to opening every song. Quick preview = confidence.
- **Save flow** should be one click, no dialog. Just save it.

## Flow 4: Teacher shares their best song

1. Teacher in `/my-songs`, has a private song they're proud of
2. Clicks the song → `/song/[id]`
3. Clicks "Share to Library"
4. Metadata dialog appears
5. Title is pre-filled — teacher edits if wanted
6. Adds subject ("Science"), curriculum ("Year 3"), keywords ("water cycle, evaporation")
7. Clicks "Share publicly"
8. Toast: "Shared to library!"
9. Page updates — song now shows public indicator, "Unshare" button replaces "Share"

## Flow 5: Generation fails

The unhappy path that has to be handled gracefully.

1. Teacher hits Generate
2. Backend returns 500 (e.g. ElevenLabs out of credits)
3. Frontend shows: "Something went wrong generating your song. Don't worry — you haven't been charged. Try again?"
4. "Try again" button retries with same inputs
5. Optional: "Contact support" link

What NOT to do:
- Don't lose their inputs. Form should still be there.
- Don't show a stack trace.
- Don't say "Error 500".

## Flow 6: School hits monthly generation limit

1. Teacher hits Generate
2. Backend returns 429
3. Frontend shows: "Your school has used all 100 generations for this month. Resets on May 1st. Talk to your school admin to upgrade."
4. Optional: "Contact admin" button

## Flow 7: Logged-out teacher tries to access an authenticated page

1. Teacher (or someone) types `lyriq.app/my-songs` directly
2. App checks auth — no token
3. Redirect to `/login`
4. After login, redirect back to `/my-songs`

## Flow 8: Token expires mid-session

1. Teacher is using the app, token quietly expires (1 hour)
2. They hit a button that triggers an API call
3. 401 returned
4. Frontend should attempt refresh using the refresh_token
5. If refresh succeeds, retry the original request transparently
6. If refresh fails, redirect to login with a "Session expired, please log in again" message

This needs to be SEAMLESS. A teacher mid-class shouldn't suddenly get logged out and panic.

---

## Edge cases to handle

- Teacher generates a song, navigates away mid-generation. Backend keeps generating. When teacher returns, song should show in `/my-songs` (or whatever).
- Teacher tries to share a song that's already public. Should be a no-op or explicit handling.
- Teacher's school admin has paused account. (Future feature, ignore for now.)
- Slow network. Show loading states. Don't freeze.
- Teacher pastes 5000 characters into the topic field. Truncate or warn.
- Teacher inputs swear words / inappropriate content. Backend filters this — frontend just trusts the response.
