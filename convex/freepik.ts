"use node";
import { action } from "@/convex/_generated/server";
import { toArrayBuffer } from "@/lib/utils";
import { v } from "convex/values";

const apiKey = process.env.FREEPIK_API_KEY;
const apiHost = "https://api.freepik.com";
interface FreepikResponse {
  data: {
    base64: string;
    has_nsfw: boolean;
  }[];
  meta: {
    image: {
      size: string;
      width: number;
      height: number;
    };
    seed: number;
    guidance_scale: number;
    prompt: string;
    num_inference_steps: number;
  };
}
export const generateFreepikAction = action({
  args: {
    prompt: v.string(),
  },
  handler: async (_, { prompt }) => {
    const response = await fetch(`${apiHost}/v1/ai/text-to-image`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-freepik-api-key": apiKey!,
      },
      body: JSON.stringify({
        prompt,
        num_images: 1,
        image: { size: "square" },
        styling: {
          style: "digital-art",
          color: "vibrant",
          lightning: "dramatic",
          framing: "portrait",
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate thumbnail");
    }

    const { data, meta } = (await response.json()) as FreepikResponse;
    try {
      const buffer = Buffer.from(data[0].base64, "base64");
      const arrayBuffer = toArrayBuffer(buffer);
      return arrayBuffer;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate thumbnail");
    }
  },
});
