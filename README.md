# Bloom (好事花开 / goodthingshappen)

> Daily 3 good things → AI-generated calendar card → shareable on Instagram & X.

## What this is

A PWA where users record 3 good things from their day. AI synthesizes the inputs into a single watercolor scene with 3 colored markers. The output is a shareable calendar card. The card is the product.

Target market: English-speaking wellness-curious adults (25-40) on Instagram/TikTok.

## Status

**Phase: Pre-development.** Design + architecture frozen 2026-05-04. First sprint: input UI without AI integration.

## Documents

- [`docs/DESIGN-DOC.md`](./docs/DESIGN-DOC.md) — full product + engineering design (CEO-approved, eng-reviewed, design-reviewed)
- `DESIGN.md` — visual design system (TBD via /design-consultation)
- `CLAUDE.md` — project conventions for Claude Code
- `TODOS.md` — deliberately deferred work (TBD)

## Tech stack (MVP)

- **Frontend:** Next.js 14 + PWA
- **Hosting:** Vercel Hobby (upgrade to Pro at 1k DAU)
- **Auth:** Supabase Auth
- **Database:** Supabase (PostgreSQL + Storage)
- **AI text:** GPT-4o mini (~$0.002/call)
- **AI image:** Replicate Flux Schnell (~$0.003/image)
- **Card compositing:** @vercel/og (satori)
- **Analytics:** PostHog

## Cost target

- 0-100 DAU: ~$4/mo
- 1,000 DAU: ~$175/mo
- Per-card unit cost: ~$0.005

## Design philosophy

> Ghibli 的皮肤，BeReal 的神经末梢，但绝不长 Duolingo 的心脏。

No streaks. No red dots. No guilt-driven retention. The card's beauty IS the growth engine.

## Phase 1 Kill Switch (must hit to continue)

1. Sharing rate >15% of cards generated
2. Organic acquisition >30% from card-referral
3. Time to value <60s from open to first card
