# 07 — Classroom Context

Important constraints and details that come from teachers actually using this in real classrooms. These shape design decisions.

## The hardware reality

Most UK primary schools have:
- **Windows laptops** — often locked-down, outdated Chrome or Edge
- **Interactive whiteboards (IWBs)** — typically connected to the laptop via HDMI/VGA, mirroring the screen
- **Sometimes a Mac** — usually the headteacher or art teacher
- **iPads** — increasingly common, but for student use mostly

What this means:
- **Don't rely on cutting-edge browser features.** Test in an older Chrome/Edge.
- **Don't assume good audio output.** Built-in laptop speakers are weak — but most classrooms have decent speakers connected.
- **The "screen" the kids see is the IWB**, which is often mirroring at a different resolution than the laptop. So the design has to work at various aspect ratios.
- **Network reliability varies.** School wifi is often slow/spotty. Cache aggressively. Don't refetch on every nav.

## The classroom flow

A song getting played in class typically goes:

1. Teacher's laptop is on, IWB is on, both screens show the same thing
2. Teacher pulls up Lyriq, navigates to the song
3. Sometimes hits projector/full-screen mode, sometimes not
4. Plays the song — children sing along reading lyrics
5. Often plays again, or skips to a specific verse

Implications:
- **Lyrics must be readable from the back of a classroom** when projected. Hence "projector mode" with huge text.
- **Pause / play / restart must be obvious and clickable from across the room** if the teacher walks around. Big buttons.
- **Skipping forward/back** is useful — sometimes a teacher wants to repeat a chorus or skip a verse.
- **Volume control** on the player is useful even if the OS has its own — saves the teacher fumbling around.

## The "in-the-moment" design imperative

When the teacher is mid-class, they don't have time to figure out a fancy UI. Everything should be:
- **Obvious.** Buttons labelled clearly. No clever icons that need decoding.
- **Forgiving.** Accidental clicks shouldn't cause data loss or weird states.
- **Resilient.** Network blips shouldn't break the audio mid-song.
- **Quick.** No 3-second loaders for things that should be instant.

## What teachers care about (research)

From talking to teachers and observing classroom use:

1. **"Will this work?"** — Reliability is everything. One broken lesson and they don't trust it again.
2. **"Will it embarrass me?"** — A song with weird/wrong/inappropriate content in front of 30 kids is a nightmare. Teachers will sanity-check before playing. Make the **preview** flow easy.
3. **"Can I find what I need fast?"** — Browsing 1000 songs is overwhelming. Filtering and search must be fast and smart.
4. **"Is this on-curriculum?"** — A song about "the Romans" needs to actually be educationally accurate. The library being curated/rated helps trust.
5. **"My kids loved Mrs Smith's song last term"** — Word-of-mouth is huge. Make it easy to **share a link** to a specific song with another teacher.

## SEN considerations

For Special Educational Needs settings, songs are particularly powerful:

- **Repetition** — SEN learners often need things repeated. The audio player should make replay one click.
- **Slower playback** — Some kids benefit from 0.75x speed. Speed control matters.
- **Calmer tones** — Bright energetic songs can overwhelm. The "calm" / "peaceful" tone options exist for this.
- **Visual focus** — Lyrics on screen with current line highlighted = huge benefit for autistic learners.

## What teachers DON'T care about

- Animations and transitions for their own sake
- Dark mode (can be added later, not v1)
- Personalisation (custom themes, etc.)
- Social features (likes, comments) — nice to have, not core
- Mobile app (they use laptops in school)
- "AI explainer" content — they just want the song, not to be lectured about how AI works

## Time pressure

Teachers prep on:
- **Sunday evenings** (most lesson planning)
- **5 minutes before class** (frantic last-minute additions)
- **Lunchtime** (planning for the afternoon)

The app needs to support both deep planning sessions AND grab-and-go.

## The gold standard reference

If you want to know what teachers want, the reference is:

**Horrible Histories songs** — short, catchy, educationally accurate, age-appropriate, memorable.

If Lyriq's songs feel like Horrible Histories songs, we win.

## What teachers tolerate

- Generation taking 30-60s — IF the UI makes it feel intentional and they trust it'll deliver
- Occasional "the song isn't quite right" — they'll regenerate
- Limited customisation in v1 — as long as the basics work

## What teachers won't tolerate

- Inappropriate content reaching their classroom
- The app breaking mid-song while 30 kids are watching
- Losing their saved songs
- Slow/buggy logins (especially shared school computers)
- Confusing UI that makes them look incompetent in front of TAs/parents

---

## TL;DR for design decisions

When in doubt:
- **Bigger text** > smaller text (classroom display)
- **More obvious buttons** > sleek-but-cryptic icons
- **Reliable basics** > clever features
- **Fast and simple** > comprehensive and complex
- **Forgiving error handling** > assuming everything works
