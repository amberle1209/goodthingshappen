# Bloom (goodthingshappen) — Session Handoff

Created: 2026-05-07
Branch: main
Repo: ~/Desktop/projects/goodthingshappen

## What Is Bloom

PWA for English-speaking wellness adults (25-40). Users record 3 daily good things, pick a mood, get an AI-generated watercolor scene on a shareable calendar card. Anti-retention philosophy: no streaks, no push notifications, no guilt.

Tech stack: Next.js 14, TypeScript, Tailwind, planned Supabase + GPT-4o mini + Replicate Flux Schnell + @vercel/og (satori).

## Completed Skills

| Skill | Date | Key Output |
|-------|------|------------|
| `/office-hours` | 2026-05-03 | Product design doc (APPROVED) |
| `/plan-eng-review` | 2026-05-07 | Architecture review + TODOS.md (front-end only) |

## What Was Built This Session

### 1. entryColor() DRY refactor
- Extracted `entryColor(palette, index)` to `src/lib/constants.ts`
- Replaced hardcoded `palette[i === 2 ? 3 : i]` in 3 files:
  - `DioramaCard.tsx` (line ~443)
  - `TearAwayLoading.tsx` (lines ~95-96)
  - `GoodThingScreen.tsx` (line ~50)
- TypeScript compiles clean, zero errors

### 2. Vitest + RTL test infrastructure
- Installed: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, @vitejs/plugin-react
- Created `vitest.config.ts` (jsdom env, @/ alias, setup file)
- Created `src/test/setup.ts` (jest-dom matchers)
- Added `test` and `test:watch` scripts to package.json
- **30 tests, all passing** (1.23s)

### 3. Test files written
- `src/lib/constants.test.ts` (18 tests): TONE_PALETTES structure, MOODS uniqueness, PROMPTS 3x5, entryColor skip-sky logic, getToday format
- `src/components/bloom/ui.test.tsx` (12 tests): StepDots count/active-width, PrimaryBtn click/disabled/style, GhostBtn click/transparent

## Git State (UNCOMMITTED)

Only 1 commit exists: `4388f0e chore: initial scaffold with design doc, CLAUDE.md, README`

All current work is unstaged/untracked. Key changed files:
- Modified: `CLAUDE.md`
- New: `DESIGN.md`, `TODOS.md`, `vitest.config.ts`, `package.json`, all `src/` files

## Artifacts Outside Repo

| Path | Content |
|------|---------|
| `~/.gstack/projects/AI/amber-unknown-design-20260503-234738.md` | Canonical Bloom design doc from /office-hours (APPROVED). Supersedes older versions. |
| `~/.gstack/projects/goodthingshappen/amber-main-eng-review-test-plan-20260507.md` | Test plan for /qa consumption |

## What's NOT Done (Backend = Zero)

No backend code exists. No API routes, no database schema, no Supabase integration, no AI image generation pipeline. Everything is front-end shell.

### TODOS.md P1 items (all pending):
1. **DioramaCard AI background** — AI image as background layer + SVG overlay for markers/petals
2. **@vercel/og card compositing** — Simplified satori layout for `/api/card/[id].png` (satori can't do perspective/blur/radial-gradient)
3. **ShareScreen data flow** — Currently mock-only, needs entries/mood/imageUrl props
4. **PWA manifest + service worker** — next-pwa or @serwist/next
5. **localStorage persistence** — Save entries/mood/step to survive refresh

### TODOS.md P2-P3 items:
- Placeholder pool expansion (15 → 60-90)
- Phase 2 comments + "AI is painting" text cleanup
- API rate limiting (Upstash Redis)
- WelcomeScreen breathing animation → CSS @keyframes
- Google Fonts → next/font migration

## Next Step: /autoplan

The user invoked `/autoplan` but needs to defer to a new session due to usage limits.

### /autoplan will do:
1. **Phase 1 (CEO Review)** — Strategy/scope review with dual voices (Codex + Claude subagent)
2. **Phase 2 (Design Review)** — UI/UX review (UI scope detected: yes)
3. **Phase 3 (Eng Review)** — Architecture + test plan with dual voices
4. **Phase 3.5 (DX Review)** — Skip (no developer-facing scope)

### Critical context for /autoplan:
- Design doc: `~/.gstack/projects/AI/amber-unknown-design-20260503-234738.md`
- /plan-eng-review already ran on front-end code; /autoplan should focus on **full-stack planning including backend**
- Key architectural decisions already made:
  - AI image as DioramaCard background + SVG overlay (not replacing 8-layer SVG)
  - Two layout strategy: interactive CSS 3D in browser, simplified satori for share image
  - Card compositing server-side via @vercel/og, not browser Canvas
- Learnings logged: `diorama-ai-integration-mismatch` (confidence 9/10), `satori-css-limitations` (confidence 9/10)

## Source File Map

```
src/
  app/
    layout.tsx          — Root layout with metadata
    page.tsx            — Entry point, BloomFlow in mobile container
    globals.css         — Design tokens, tone variants, paper textures, keyframes
  components/bloom/
    BloomFlow.tsx       — 7-step state machine (steps 0-7)
    WelcomeScreen.tsx   — Step 0: breathing dot (perf issue: setInterval 60ms)
    GoodThingScreen.tsx — Steps 1-3: prompt + textarea + particles
    MoodScreen.tsx      — Step 4: 3x2 mood grid
    TearAwayLoading.tsx — Step 5: tear animation + loading (hardcoded 6.8s timer)
    RevealScreen.tsx    — Step 6: DioramaCard wrapper
    ShareScreen.tsx     — Step 7: mock share (needs real implementation)
    DioramaCard.tsx     — 8-layer parallax card (468 lines)
    Particles.tsx       — Keystroke petal/dot particles
    ui.tsx              — PrimaryBtn, GhostBtn, StepDots
    ui.test.tsx         — 12 UI component tests
    index.ts            — Barrel exports
  lib/
    types.ts            — ToneName, Palette, DateInfo, MoodId, MoodOption
    constants.ts        — Palettes, moods, prompts, entryColor(), getToday()
    constants.test.ts   — 18 lib unit tests
  test/
    setup.ts            — jest-dom vitest setup
```

## How to Resume

```bash
cd ~/Desktop/projects/goodthingshappen
# Run /autoplan to get full-stack planning (CEO → Design → Eng review pipeline)
```

The session should invoke `/autoplan` directly. All context is in this file + TODOS.md + DESIGN.md + the design doc at `~/.gstack/projects/AI/amber-unknown-design-20260503-234738.md`.
