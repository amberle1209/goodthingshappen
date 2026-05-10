import type { PromptInput } from "./promptTemplate";

const MOCK_SCENES = [
  "A quiet garden path winding through soft morning mist, warm golden light filtering through birch trees. Three small wildflowers bloom at the path's edge in amber, sage, and sky blue. Watercolor washes with visible paper grain, gentle dappled shadows, a wooden bench barely visible in the distance.",
  "A still pond reflecting a twilight sky in muted lavender and peach. Reeds sway gently at the water's edge. Three smooth stones rest on the bank, each catching the last light differently. Soft watercolor bleeds, wet-on-wet technique, atmospheric perspective fading to warm cream at the edges.",
  "A rooftop view at golden hour, city skyline soft and distant. A small table holds an empty teacup still steaming. Three paper lanterns float upward, glowing amber, green, and gentle blue. Nostalgic watercolor style, warm undertones, visible brushstrokes, light bleeding through clouds.",
];

export function generateMockScenePrompt(input: PromptInput): string {
  const idx =
    input.entries.join("").length % MOCK_SCENES.length;
  return MOCK_SCENES[idx];
}
