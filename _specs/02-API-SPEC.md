# 02 — API Specification

## Backend Base URL

```
https://lyriq-backend-production-bb5b.up.railway.app
```

All endpoints are prefixed with `/api/v1`.

Health check (no auth needed): `GET /health`

## Authentication

Most endpoints require a Bearer token:
```
Authorization: Bearer <access_token>
```

Get the token by hitting `/auth/login` or `/auth/register`. Store it in the frontend (httpOnly cookie preferred, localStorage acceptable for v1) and include it in every request.

Tokens expire — handle 401 errors by redirecting to login.

## Test Account

For development/testing:
- Email: `mark789789@hotmail.com`
- Password: (the user has it)

This account already has one shared song in the library: "The Water Cycle Song"

---

## Endpoints

### POST /api/v1/auth/register

Register a new teacher.

**Request body:**
```json
{
  "email": "teacher@school.com",
  "password": "atleast8chars",
  "display_name": "Ms Smith",
  "school_name": "Springfield Primary",
  "school_type": "primary",
  "country": "GB"
}
```

`school_type` must be one of: `sen`, `primary`, `secondary`, `home`, `other`

**Response 200:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "Ms Smith",
    "country": "GB",
    "is_public": false,
    "songs_created": 0,
    "songs_shared": 0,
    "total_downloads": 0,
    "total_likes": 0,
    "average_rating_received": 0.0,
    "reputation_score": 10,
    "badges": [],
    "created_at": "2026-04-30T..."
  }
}
```

---

### POST /api/v1/auth/login

**Request body:**
```json
{
  "email": "teacher@school.com",
  "password": "password"
}
```

**Response:** Same shape as `/register`.

---

### POST /api/v1/auth/refresh

**Request body:**
```json
{
  "refresh_token": "eyJ..."
}
```

**Response:** Same shape as `/login`.

---

### POST /api/v1/songs/generate

Generates a song. **This is the slowest endpoint** — typically 30–60 seconds. Show clear progress UI.

**Auth required.**

**Request body:**
```json
{
  "topic": "The water cycle, focus on evaporation and condensation",
  "genre": "rock",
  "tone": "happy",
  "age_range": "6-9",
  "language": "en",
  "subject": "Science",
  "curriculum_area": "Year 3",
  "keywords": ["water cycle", "evaporation"],
  "share_to_library": false
}
```

**Enum values (must match exactly):**

- `genre`: `pop`, `rap`, `chant`, `rock`, `country`, `lullaby`, `folk`
- `tone`: `calm`, `happy`, `encouraging`, `energetic`, `silly`, `peaceful`
- `age_range`: `3-5` (Early Years), `6-9` (KS1), `10-13` (KS2)
- `language`: `en`, `de`, `fr`, `es`, `it`, `nl`, `pl`, `sv`, `da`, `no`, `fi`, `pt`

**Response 200:**
```json
{
  "success": true,
  "song": {
    "id": "uuid",
    "title": "The Water Cycle Song",
    "topic": "The water cycle...",
    "genre": "rock",
    "tone": "happy",
    "age_range": "6-9",
    "language": "en",
    "subject": "Science",
    "lyrics": "[Intro]\n(2 bars instrumental)\n\n[Verse 1]\nThe sun heats up...",
    "audio_url": "https://.../audio.mp3",
    "preview_url": "https://.../preview.mp3",
    "duration_seconds": 99,
    "is_public": false,
    "status": "ready",
    "download_count": 0,
    "like_count": 0,
    "average_rating": 0,
    "rating_count": 0,
    "created_at": "2026-04-30T..."
  },
  "usage": {
    "generations_used": 5,
    "generations_limit": 100,
    "generations_remaining": 95,
    "reset_date": null
  }
}
```

**Lyrics format:** The lyrics come back with structural markers in square brackets: `[Intro]`, `[Verse 1]`, `[Chorus]`, `[Verse 2]`, `[Bridge]`, `[Outro]`. Style these distinctly in the UI (e.g., smaller, lighter colour, italics). Blank lines separate sections.

**Errors:**
- `400` — bad input (e.g., invalid genre)
- `429` — rate limit hit (school used up monthly generations)
- `500` — generation failed (ElevenLabs out of credits, Claude API error, etc.)

---

### GET /api/v1/songs/my

Get the current user's songs (paginated).

**Auth required.**

**Query params:** `page` (default 1), `limit` (default 20, max 100)

**Response:**
```json
{
  "songs": [SongResponse, ...],
  "page": 1,
  "limit": 20,
  "total": 5,
  "pages": 1
}
```

---

### GET /api/v1/songs/{song_id}

Get a specific song. User must be owner OR song must be public.

---

### PATCH /api/v1/songs/{song_id}

Update a song (owner only).

**Request body (all fields optional):**
```json
{
  "title": "New title",
  "subject": "History",
  "curriculum_area": "Year 4",
  "keywords": ["romans", "food"],
  "is_public": true
}
```

---

### DELETE /api/v1/songs/{song_id}

Delete a song (owner only).

---

### POST /api/v1/songs/{song_id}/share

Share a song to the public library. Optionally update metadata at the same time.

**Request body (all optional):**
```json
{
  "title": "The Water Cycle (Revised)",
  "keywords": ["water cycle", "science", "year 3"],
  "subject": "Science",
  "curriculum_area": "Year 3"
}
```

**Response:** Full `SongResponse` with `is_public: true`.

---

### POST /api/v1/songs/{song_id}/unshare

Make a song private again.

---

### GET /api/v1/library

Browse the public library.

**Query params:**
- `genre` — filter by genre
- `tone` — filter by tone
- `age_range` — filter by age range
- `language` — filter by language
- `subject` — filter by subject
- `min_rating` — 0-5
- `sort` — `downloads` (default), `rating`, `newest`, `trending`
- `page` — default 1
- `limit` — default 20, max 100

**Auth optional** — if logged in, response includes user-specific fields like `is_liked` and `is_downloaded`.

**Response:**
```json
{
  "songs": [
    {
      "id": "uuid",
      "title": "...",
      "topic": "...",
      "genre": "rock",
      "tone": "happy",
      "age_range": "6-9",
      "language": "en",
      "subject": "Science",
      "preview_url": "https://...",
      "duration_seconds": 99,
      "download_count": 0,
      "like_count": 0,
      "average_rating": 4.5,
      "rating_count": 2,
      "created_at": "2026-04-29T...",
      "creator": {
        "id": "uuid",
        "display_name": "Test Teacher",
        "avatar_url": null,
        "reputation_score": 10
      }
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "pages": 1,
  "filters_applied": { ... }
}
```

---

### GET /api/v1/library/search

Search public songs.

**Query params:**
- `q` (required, 2–200 chars) — search query
- `age_range`, `language`, `page`, `limit` — same as `/library`

---

### GET /api/v1/library/trending

Top trending songs this week. Default limit 10.

---

### GET /api/v1/library/top-rated

Top rated songs (>= 4 stars). Default limit 10.

---

### GET /api/v1/library/song/{song_id}

Get a single public song with full details. Includes user-specific fields if authenticated.

---

### POST /api/v1/library/song/{song_id}/download

Record that the user downloaded a song. Returns full song object including the full `audio_url` (not just preview).

**Auth required.**

---

### POST /api/v1/library/song/{song_id}/like

Like a song. Idempotent.

---

### DELETE /api/v1/library/song/{song_id}/like

Unlike.

---

### POST /api/v1/library/song/{song_id}/rate

Rate 1–5 stars.

**Request body:**
```json
{ "rating": 5 }
```

---

### GET /api/v1/library/song/{song_id}/comments

Get comments for a song. Paginated.

---

### POST /api/v1/library/song/{song_id}/comments

Add a comment.

**Request body:**
```json
{ "content": "Used this with my Year 4 class — they loved it!" }
```

---

### POST /api/v1/library/song/{song_id}/report

Report a song.

**Request body:**
```json
{
  "reason": "inappropriate",
  "details": "Optional explanation"
}
```

`reason` must be: `inappropriate`, `copyright`, `incorrect`, `spam`, `other`

---

### Collections (saved playlists)

- `GET /api/v1/collections` — get user's collections
- `POST /api/v1/collections` — create collection
- `POST /api/v1/collections/{id}/songs?song_id=...` — add song
- `DELETE /api/v1/collections/{id}/songs/{song_id}` — remove

(Skip these for MVP — return to them in v2.)

---

### Profile

- `GET /api/v1/profile` — current user's profile
- `PATCH /api/v1/profile` — update display name, bio, etc.
- `GET /api/v1/profile/{id}` — public profile view

---

### School

- `GET /api/v1/school` — current school info
- `GET /api/v1/school/usage` — generations used this month

Use `/school/usage` to show teachers their remaining song budget.

---

## Error response shape

All errors follow this shape:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "detail": "More technical detail or null in production"
}
```

## Common gotchas

- **Generation is slow.** 30–60s. Don't timeout the request. Show progress.
- **Audio URLs are signed Supabase storage URLs.** They work directly in `<audio>` tags.
- **Lyrics include `[Intro]`, `[Outro]` markers** — these are mostly empty placeholders for the music. Display them but make them visually distinct.
- **Genres are an enum.** Don't accept arbitrary strings.
- **The school context** — every teacher belongs to a school. School has a generation budget. Hit the limit and `/songs/generate` returns 429.
