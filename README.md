# Play by Choice

A collaborative music queue. You create a Space, pull in songs from your Spotify or YouTube account, and everyone in the room votes on what plays next. The queue isn't first-come-first-served — it's whatever people actually want to hear.

<div align="center">
  <img src="assets/music.gif" alt="Play by Choice in action" width="720" />
</div>

## Why this exists

Every shared queue app I've tried eventually falls apart the same way: whoever adds songs first dominates the whole session. Play by Choice flips the flow. Members add songs to a Space, others upvote the ones they like, and the player always picks the highest-voted track as the next one. The person who controls the speaker can't skip the room's opinion — the room *is* the queue.

A few ground rules keep things sane: each user can add up to **3 songs** per Space, a Space caps out at **70 songs**, and duplicate tracks are rejected at creation time. Votes are one per person per song, and you can take yours back if you change your mind.

## How it works

1. Sign in with Google or Spotify (OAuth only — no separate password to forget).
2. Create a Space and share the link with whoever's listening.
3. Members browse their own Spotify playlists / YouTube library and add tracks to the queue.
4. Everyone upvotes. The current track finishes, and the top-voted song takes over automatically.
5. The Space owner (OWNER role) manages playback; everyone else (MEMBER) adds and votes.

Playback runs entirely in the browser — a Spotify Web Playback SDK session or a YouTube IFrame player, depending on which provider the Space uses. Token refresh is handled quietly in the background (NextAuth JWT callbacks) so the music doesn't stop mid-session.

## Under the hood

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router), TypeScript |
| UI | Tailwind CSS, shadcn/ui, Radix primitives, Framer Motion |
| Auth | NextAuth.js (Google + Spotify), JWT sessions |
| Database | PostgreSQL via Prisma, hosted on Neon |
| Caching | Redis (space and stream reads, ~15 min TTL) |
| Validation | Zod, on both API routes and forms |

The schema is small on purpose: `User`, `Space`, `Stream` (a queued song), `Upvote`, and `CurrentStream` (a pointer to what's playing right now). Everything else is derived. If you're curious, it's all in [`prisma/schema.prisma`](prisma/schema.prisma).

One deliberate trade-off: the queue sorting is done at read time rather than through a background worker. It's simpler, and for room-sized groups the query is trivially cheap. Redis absorbs the repeated polling so Postgres isn't hammered.

## Running it locally

You'll need Node 18+, a PostgreSQL database, and a Redis instance. I use [Neon](https://neon.tech) for Postgres (the repo also has a workflow that spins up a Neon branch per PR) and Upstash for Redis, but anything speakable works.

```bash
git clone https://github.com/abdurrab-khan/play-by-choice.git
cd play-by-choice
npm install
```

Grab your OAuth credentials first:

- **Google** — create an OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) with the `youtube.readonly` scope.
- **Spotify** — register an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and add your callback URL under Redirect URIs.
- **NextAuth** — any long random string for `NEXT_AUTH_SECRET` (`openssl rand -base64 32` does the job).

Then fill in `.env` at the project root:

```bash
# Database
POSTGRES_PRISMA_URL="postgresql://user:password@host/db?sslmode=require"

# Auth
NEXT_AUTH_SECRET="some-long-random-string"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
SPOTIFY_CLIENT_ID="..."
SPOTIFY_CLIENT_SECRET="..."

# Redis
REDIS_HOST="..."
REDIS_PORT="6379"
REDIS_PASSWORD="..."
```

Push the schema and start the dev server:

```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in, and create your first Space. That's it.

> **Spotify note:** Web Playback SDK playback requires a Spotify Premium account. Free accounts can still sign in, browse, and vote — they just can't host the player.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at `localhost:3000` |
| `npm run build` | Prisma generate, then production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run predeployment-check` | Build + typecheck + lint + prisma generate, all gated — run before any deploy |

## Project layout

```
src/
├── app/
│   ├── (auth)/sign-in/        # Sign-in page
│   ├── (app)/dashboard/       # Dashboard + Space detail (inside a Space)
│   └── api/                   # Route handlers: space, stream, upvote, auth
├── components/
│   ├── Space/                 # Create/list/delete Space, queue, voting UI
│   ├── Stream/                # Queue cards
│   └── ui/                    # shadcn/ui primitives
├── lib/
│   ├── action/                # Server actions (space, stream, spotify, youtube)
│   ├── redis-client.ts        # Singleton Redis client
│   └── db.ts                  # Prisma client
└── middleware.ts              # Auth gating for /dashboard, redirects for / and /sign-in
```

## Contributing

Issues and PRs are welcome. If you're touching the queue/voting logic, please run `npm run predeployment-check` before pushing — it catches the type and lint issues that tend to sneak in. For bigger changes, open an issue first so we don't build the same thing twice.

