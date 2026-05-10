import type { ToneName } from "../types";

export const PROMPT_VERSION = "v1";

const TONE_STYLES: Record<ToneName, string> = {
  ghibli:
    "Studio Ghibli watercolor style: soft washes, visible paper texture, warm natural palette, dappled light filtering through leaves, nostalgic and peaceful atmosphere",
  washi:
    "Japanese washi paper ink wash: muted earth tones, deliberate brushstrokes, negative space, wabi-sabi imperfection, contemplative stillness",
  dawn:
    "Scandinavian dawn watercolor: cool muted blues and sage greens, gentle morning light, minimal composition, clean and calming, hygge warmth",
};

const SYSTEM_PROMPT = `You are a visual scene designer for a gratitude journaling app called Bloom. Your job is to read 3 short personal entries about good things that happened today, feel the emotional texture, and output a single scene description for an AI image generator.

Rules:
- Output ONLY the scene description, nothing else. No preamble, no explanation.
- The scene must be a landscape or environment, never a portrait of a person.
- Weave subtle visual metaphors from the entries. If someone mentions "warm coffee," place steam or a warm glow — don't paint a literal coffee cup.
- The scene should feel like a place you could step into and feel what the writer felt.
- Keep the description under 120 words.
- Include specific art direction: lighting, color temperature, composition, texture.
- Never include text, words, letters, or watermarks in the scene.
- Never include faces, identifiable people, or body parts.
- The mood parameter shapes the emotional tone of the scene.`;

export interface PromptInput {
  entries: string[];
  mood: string;
  tone: ToneName;
}

export function buildUserPrompt(input: PromptInput): string {
  const toneStyle = TONE_STYLES[input.tone];
  const entriesText = input.entries
    .map((e, i) => `${i + 1}. ${e}`)
    .join("\n");

  return `Entries:
${entriesText}

Mood: ${input.mood}

Art style: ${toneStyle}

Generate a scene description for these entries.`;
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
