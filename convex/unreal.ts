"use node";
import { action } from "@/convex/_generated/server";
import { v } from "convex/values";
import UnrealSpeech from "unrealspeech";

const unrealSpeech = new UnrealSpeech(process.env.UNREAL_SPEECH_API_KEY!);

export const generateAudioAction = action({
  args: {
    input: v.string(),
    voice: v.string(),
  },
  handler: async (ctx, args) => {
    const speechBuffer = await unrealSpeech.stream(
      args.input,
      args.voice,
      "192k",
      0,
      1.0
    );
    return speechBuffer.buffer;
  },
});
