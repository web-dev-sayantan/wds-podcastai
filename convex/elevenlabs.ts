"use node";

import { action } from "@/convex/_generated/server";
import { v } from "convex/values";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});
export const generateAudioAction = action({
  args: {
    input: v.string(),
    voice: v.string(),
  },
  handler: async (ctx, args) => {
    const audio = await elevenlabs.generate({
      voice: args.voice,
      text: args.input,
      model_id: "eleven_monolingual_v1",
    });
    const readableAudio = Readable.from(audio);
    const chunks = [];

    for await (const chunk of readableAudio) {
      chunks.push(chunk);
    }
    return new Blob(chunks).arrayBuffer();
  },
});
