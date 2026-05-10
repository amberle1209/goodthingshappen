import Replicate from "replicate";

export interface ImageGenerationResult {
  predictionId: string;
}

export interface ImageStatusResult {
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  imageUrl?: string;
  error?: string;
}

export interface ImageProvider {
  startGeneration(scenePrompt: string): Promise<ImageGenerationResult>;
  checkStatus(predictionId: string): Promise<ImageStatusResult>;
}

/* ─── Mock Provider (dev without API keys) ─────────── */

const MOCK_IMAGES = [
  "https://placehold.co/1080x1920/e8d5b7/3a2e22?text=Bloom+Scene+1",
  "https://placehold.co/1080x1920/c6d8c0/3a2e22?text=Bloom+Scene+2",
  "https://placehold.co/1080x1920/b7cfe8/3a2e22?text=Bloom+Scene+3",
];

export class MockProvider implements ImageProvider {
  private pending = new Map<string, { resolve: number }>();

  async startGeneration(_scenePrompt: string): Promise<ImageGenerationResult> {
    const id = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.pending.set(id, { resolve: Date.now() + 3000 });
    return { predictionId: id };
  }

  async checkStatus(predictionId: string): Promise<ImageStatusResult> {
    const entry = this.pending.get(predictionId);
    if (!entry) {
      return { status: "failed", error: "Unknown prediction" };
    }

    if (Date.now() < entry.resolve) {
      return { status: "processing" };
    }

    this.pending.delete(predictionId);
    const imageUrl =
      MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
    return { status: "succeeded", imageUrl };
  }
}

/* ─── Flux Schnell Provider (production) ───────────── */

export class FluxSchnellProvider implements ImageProvider {
  private replicate: Replicate;

  constructor() {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      throw new Error("Missing REPLICATE_API_TOKEN");
    }
    this.replicate = new Replicate({ auth: apiToken });
  }

  async startGeneration(scenePrompt: string): Promise<ImageGenerationResult> {
    const prediction = await this.replicate.predictions.create({
      model: "black-forest-labs/flux-schnell",
      input: {
        prompt: scenePrompt,
        num_outputs: 1,
        aspect_ratio: "9:16",
        output_format: "png",
        output_quality: 90,
      },
    });

    return { predictionId: prediction.id };
  }

  async checkStatus(predictionId: string): Promise<ImageStatusResult> {
    const prediction = await this.replicate.predictions.get(predictionId);

    if (prediction.status === "succeeded") {
      const output = prediction.output as string[] | string | null;
      const imageUrl = Array.isArray(output) ? output[0] : output;
      if (!imageUrl) {
        return { status: "failed", error: "No image URL in output" };
      }
      return { status: "succeeded", imageUrl };
    }

    if (prediction.status === "failed" || prediction.status === "canceled") {
      return {
        status: prediction.status,
        error: prediction.error?.toString() ?? "Unknown error",
      };
    }

    return { status: prediction.status as "starting" | "processing" };
  }
}

/* ─── Provider factory ─────────────────────────────── */

let _provider: ImageProvider | null = null;

export function getImageProvider(): ImageProvider {
  if (!_provider) {
    const hasReplicateKey = !!process.env.REPLICATE_API_TOKEN;
    _provider = hasReplicateKey
      ? new FluxSchnellProvider()
      : new MockProvider();
  }
  return _provider;
}
