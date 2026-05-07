# CLAUDE.md — Bloom (goodthingshappen)

Project-level instructions for Claude Code. Read before any work in this repo.

## Project context

Bloom is a PWA for English-speaking wellness-curious adults (25-40). User inputs 3 good things daily → AI generates a watercolor scene → outputs a shareable calendar card.

Full design at `docs/DESIGN-DOC.md`. Read before changing anything visual or architectural.

## Design philosophy (non-negotiable)

> Ghibli 的皮肤，BeReal 的神经末梢，但绝不长 Duolingo 的心脏。

- **No streaks displayed anywhere** (not on home, not on shared cards)
- **No push notifications** (PWA + philosophy)
- **No red dots, no badge counts, no guilt copy** ("You haven't journaled today" is forbidden)
- **No social proof FOMO** ("Your friends are all journaling")
- Day 2 email is **opt-in default OFF**
- Limited colors unlock invisibly (no toast, no celebration)
- The card's beauty IS the growth engine. Any mechanic that erodes beauty erodes growth.

## Code conventions

### Architecture
- Thin API routes in `app/api/*/route.ts`. Business logic in `lib/`
- Image API behind `lib/scene/imageProvider.ts` interface (Flux Schnell default, DALL-E/Ideogram swappable)
- Prompt templates versioned in `lib/scene/promptTemplate.ts` (DB stores `prompt_version`)
- Card compositing via `@vercel/og` server-side, cached to Supabase Storage `cards/[id].png`
- Don't write Phase 2/3/4 code in MVP. Delete `// TODO: support 3d` on sight.

### Quality bar (this is "极致设计" mode)
- Every animation has a duration in ms (not "fast" or "slow")
- Every padding/font-size references DESIGN.md tokens (no magic numbers)
- AI scene prompts must pass eval suite ≥4.0/5.0 on 50 fixtures before launch
- 80%+ test coverage. E2E covers 3 critical flows.
- Failure states are designed first-class. No silent failures.

### Commit & PR
- Commit format: `<type>: <description>` (feat, fix, refactor, docs, test, chore, perf, ci)
- No `git add -A`. Stage by name.
- Never `--amend` after pre-commit hook failure. Make a new commit.

## Skill routing

When user request matches a skill, invoke it via the Skill tool.

- Product brainstorming → `/office-hours`
- Strategy/scope review → `/plan-ceo-review`
- Architecture review → `/plan-eng-review`
- Design system / plan visual review → `/design-consultation` or `/plan-design-review`
- Visual design exploration → `/design-shotgun`
- Full review pipeline → `/autoplan`
- Bugs / errors → `/investigate`
- QA testing → `/qa` or `/qa-only`
- Code review of diff → `/review`
- Visual polish on live site → `/design-review`
- Ship → `/ship` then `/land-and-deploy`
- Save context → `/context-save`
- Resume → `/context-restore`

## Key paths

- Design doc (canonical): `docs/DESIGN-DOC.md`
- Design system (TBD): `DESIGN.md`
- Research notes: `~/Documents/Obsidian Vault/ai/business/AI创业副业/bloom-app-research.md`
- gstack project memory: `~/.gstack/projects/AI/`

## Project location

This repo lives in `~/Desktop/projects/goodthingshappen/`.

## Phase 1 Kill Switch (success criteria)

These gate continued investment after MVP launch:

1. **Sharing rate >15%** of generated cards
2. **Organic acquisition >30%** from card referrals
3. **Time to value <60s** from first open to first card

If any miss after 100 DAU + 4 weeks, stop and reassess product direction.
