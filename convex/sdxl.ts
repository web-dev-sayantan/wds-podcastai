"use node";
import { action } from "@/convex/_generated/server";
import { toArrayBuffer } from "@/lib/utils";
import { v } from "convex/values";

interface GenerationResponse {
  artifacts: {
    base64: string;
    seed: number;
    finishReason: string;
  }[];
}

const engineId = "stable-diffusion-xl-1024-v1-0";
const apiHost = "https://api.stability.ai";
const apiKey = process.env.STABILITY_API_KEY;

export const generateTSDXLhumbnailAction = action({
  args: {
    prompt: v.string(),
  },
  handler: async (_, { prompt }) => {
    if (!apiKey) {
      throw new Error("STABILITY_API_KEY is not set");
    }
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate thumbnail");
    }

    const { artifacts } = (await response.json()) as GenerationResponse;
    try {
      const buffer = Buffer.from(artifacts[0].base64, "base64");
      const arrayBuffer = toArrayBuffer(buffer);
      console.log("Buffer", arrayBuffer);
      return arrayBuffer;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate thumbnail");
    }
  },
});
