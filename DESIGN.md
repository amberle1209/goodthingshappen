# Bloom Design System

Source of truth for all visual decisions. Derived from the Claude Design handoff (2026-05-06).

## Typography

| Token       | Family                                  | Usage              |
|-------------|-----------------------------------------|--------------------|
| `--display` | Fraunces, Newsreader, Georgia, serif    | Headlines, buttons, card titles, prompts |
| `--body`    | Newsreader, Fraunces, Georgia, serif    | Body text, textarea input |
| `--mono`    | JetBrains Mono, ui-monospace, monospace | Labels, dates, step indicators, eyebrows |

### Scale

| Context            | Size  | Weight | Style   |
|--------------------|-------|--------|---------|
| Welcome headline   | 38px  | 400    | normal (accent word italic) |
| Screen prompt      | 32px  | 400    | normal (keyword italic) |
| Share headline     | 30px  | 400    | normal  |
| Card "bloom" title | 22px  | —      | italic  |
| Button label       | 18px  | —      | italic  |
| Sub-headline       | 17px  | —      | italic  |
| Body / textarea    | 19px  | —      | normal  |
| Mood label         | 16px  | —      | italic  |
| Encouragement      | 14px  | —      | italic  |
| Mono eyebrow       | 11px  | 400    | normal  |
| Mono small         | 9-10px| 400    | normal  |
| Mono micro         | 8px   | 400    | normal  |

## Color Tokens

### Base (`:root`)

| Token              | Value                      |
|--------------------|----------------------------|
| `--tone-bg`        | `#f5efe2`                  |
| `--tone-paper`     | `#fbf7ec`                  |
| `--tone-ink`       | `#2d2820`                  |
| `--tone-ink-soft`  | `#5b524a`                  |
| `--tone-accent`    | `#c46a3a` (warm cinnabar)  |
| `--tone-leaf`      | `#6e8b5a` (sage)           |
| `--tone-rule`      | `rgba(45,40,32,0.14)`      |
| `--tone-shadow`    | `rgba(45,40,32,0.18)`      |

### Tone Palettes (scene colors)

Each tone provides `[accent, leaf, sky, sun]`:

| Tone    | Accent    | Leaf      | Sky       | Sun       |
|---------|-----------|-----------|-----------|-----------|
| ghibli  | `#c46a3a` | `#6e8b5a` | `#7aa3c6` | `#e3b659` |
| washi   | `#b03a2e` | `#7d6a36` | `#a89466` | `#d8a548` |
| dawn    | `#5b7c8a` | `#889a7a` | `#bfc8cf` | `#d6c7a3` |

### Tone Variant Overrides

Each `[data-tone]` attribute on a parent element overrides `--tone-*` CSS variables. See `globals.css`.

## Surfaces

### Paper textures (CSS classes)

- `.paper` — Full paper with fiber grain overlay (radial gradient noise + repeating linear hatching)
- `.paper-soft` — Lighter paper with subtle vignette (no hatching)

### Shadows

| Context       | Value                                                   |
|---------------|---------------------------------------------------------|
| Card          | `0 30px 60px rgba(45,40,32,0.28), 0 0 0 1px rgba(45,40,32,0.06)` |
| Button        | `0 8px 22px rgba(45,40,32,0.18)`                       |
| Mood active   | `0 8px 22px rgba(45,40,32,0.14), inset 0 1px 0 rgba(255,255,255,0.7)` |
| Input area    | `inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 14px rgba(45,40,32,0.05)` |
| Diorama inset | `inset 0 6px 14px rgba(45,40,32,0.06), inset 0 -2px 8px rgba(45,40,32,0.04)` |

## Radii

| Element        | Radius |
|----------------|--------|
| Card           | 22px   |
| Diorama window | 16px   |
| Mood tile      | 22px   |
| Input area     | 18px   |
| Share option   | 16px   |
| Confirmation   | 14px   |
| Button         | 26px   |
| Pill / tag     | 99px   |

## Spacing

| Token               | Value     |
|----------------------|-----------|
| Screen padding top   | 56px      |
| Content padding x    | 24-32px   |
| Bottom padding       | 28px      |
| Section gap          | 24px      |
| Card width           | 320px     |
| Card height          | 540px     |

## Animation

### Keyframes

| Name         | Duration | Easing                            | Usage              |
|--------------|----------|-----------------------------------|--------------------|
| `float-up`   | 1.2-2s   | `.2,.7,.3,1`                      | Keystroke particles |
| `ink-bloom`  | 1.8-2.2s | ease-in-out                       | Loading blobs       |
| `seal-pulse` | 3s       | ease-in-out                       | Wax seal (envelope) |
| `hint-pulse` | 1.6s     | ease-in-out                       | Drag hint           |
| `shimmer`    | —        | linear                            | Reserved            |

### Transitions

| Context            | Duration | Easing                          |
|--------------------|----------|---------------------------------|
| Layer parallax     | 250ms    | `cubic-bezier(.2,.7,.3,1)`      |
| Bowl tilt          | 350ms    | `cubic-bezier(.2,.7,.3,1)`      |
| Card reveal        | 1000ms   | `cubic-bezier(.2,.7,.3,1)`      |
| Button state       | 250ms    | ease                            |
| Step dot expansion | 300ms    | `cubic-bezier(.2,.7,.3,1)`      |
| Encouragement      | 400ms    | `cubic-bezier(.2,.7,.3,1)`      |
| Tear Phase 1       | 600ms    | `cubic-bezier(.4,0,.2,1)`       |
| Tear Phase 2       | 1600ms   | `cubic-bezier(.6,0,.2,1)`       |
| Curl rotation      | 700ms    | `cubic-bezier(.4,0,.2,1)`       |

## Flow (7 Steps)

```
0. Welcome       — breathing dot + headline + "begin →"
1. Good Thing #1  — prompt + textarea + particles
2. Good Thing #2  — same structure, different prompt set
3. Good Thing #3  — same structure, "last step →"
4. Mood           — 3×2 grid of 6 moods + "paint my day →"
5. Tear + Loading — 5-phase tear animation → ink-bloom loading
6. Reveal         — DioramaCard with 8-layer parallax + "share →"
7. Share          — 4 share targets + confirmation
```

## DioramaCard Layers (depth order)

| Layer | Content          | Depth | Description                    |
|-------|------------------|-------|--------------------------------|
| 1     | Sun              | -2    | Radial gradient glow + core    |
| 2     | Far hills        | -1.2  | SVG path, leaf color, 32% opacity |
| 3     | Birds            | -0.4  | SVG v-shapes in accent color   |
| 4     | Mid hills        | -0.4  | SVG path, leaf color, 55% opacity |
| 5     | Tree             | 0.5   | SVG trunk + ellipse canopy     |
| 6     | Meadow           | 0.8   | SVG path, accent color, 40% opacity |
| 7     | Markers (×3)     | 1.5   | SVG pin icons with labels 1/2/3 |
| 8     | Foreground petals | 2.4   | SVG petal shapes, pointer-events none |

## Component Map

```
src/components/bloom/
  BloomFlow.tsx       — Flow controller (step state machine)
  WelcomeScreen.tsx   — Step 0: breathing dot + headline
  GoodThingScreen.tsx — Steps 1-3: prompt + textarea + particles
  MoodScreen.tsx      — Step 4: mood picker grid
  TearAwayLoading.tsx — Step 5: tear animation + loading underlay
  RevealScreen.tsx    — Step 6: DioramaCard wrapper
  ShareScreen.tsx     — Step 7: share options
  DioramaCard.tsx     — Hero card with 8-layer parallax diorama
  Particles.tsx       — Keystroke-triggered petal/dot particles
  ui.tsx              — PrimaryBtn, GhostBtn, StepDots
  index.ts            — Barrel exports
```

## AI Scene Integration (Future)

The DioramaCard's 8-layer structure is the runtime contract. When wiring Flux Schnell:

- **Phase 1 (MVP, ~$0.003/card)**: Single image + CSS mask slicing into 3 horizontal bands
- **Phase 2 (~$0.012/card)**: Multi-layer PNGs with transparency (sky+sun, hills, foreground)
- **Phase 3 (~$0.01/card)**: Depth-map displacement (Flux + MiDaS/ZoeDepth → WebGL)

In all phases, the parallax math and layer DOM structure stay identical.
