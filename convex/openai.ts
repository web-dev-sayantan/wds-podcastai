import { action } from "@/convex/_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAudioAction = action({
  args: {
    input: v.string(),
    voice: v.string(),
  },
  handler: async (_, { input, voice }) => {
    console.log("Generating audio for input:", input);
    console.log("Voice:", voice);
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams["voice"],
      input,
    });
    const buffer = await mp3.arrayBuffer();
    return buffer;
  },
});

export const generateThumbnailAction = action({
  args: {
    prompt: v.string(),
  },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      model: "dall-e-3",
      quality: "standard",
    });
    const url = response.data[0].url;
    if (!url) {
      throw new Error("Failed to generate thumbnail");
    }
    const image = await fetch(url);
    const buffer = await image.arrayBuffer();
    return buffer;
  },
});
