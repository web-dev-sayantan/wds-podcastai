import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { GeneratePodcastProps } from "@/types";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

const useGeneratePodcast = ({
  voicePrompt,
  setAudioUrl,
  setAudioStorageId,
  voiceType,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const generateUploadUrlMutation = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrlMutation);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  // const getPodcastAudio = useAction(api.elevenlabs.generateAudioAction);
  // const getPodcastAudio = useAction(api.unreal.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudioUrl("");
    if (!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsGenerating(false);
    }

    if (!voicePrompt) {
      // TODO: show error message
      return setIsGenerating(false);
    }
    try {
      const response = await getPodcastAudio({
        input: voicePrompt,
        voice: voiceType,
      });
      const filename = `podcast-${uuidv4()}.mp3`;
      const file = new File([response], filename, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudioUrl(audioUrl!);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label htmlFor="" className="text-16 font-bold text-white-1">
          AI prompt
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text for the podcast"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating...
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate Podcast"
          )}
        </Button>
      </div>
      {props.audioUrl && (
        <audio
          src={props.audioUrl}
          controls
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => {
            props.setAudioDuration(e.currentTarget.duration);
          }}
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
