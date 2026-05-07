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

let _provider: ImageProvider | null = null;

export function getImageProvider(): ImageProvider {
  if (!_provider) {
    _provider = new FluxSchnellProvider();
  }
  return _provider;
}
