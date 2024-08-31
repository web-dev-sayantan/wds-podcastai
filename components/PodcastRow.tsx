"use client";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/formatTime";
import { useAudio } from "@/providers/audioProvider";
import { Clock, Play, Timer } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

interface PodcastRowProps {
  id: string;
  imageUrl: string;
  title: string;
  views: number;
  audioUrl: string;
  author: string;
}

const PodcastRow = ({
  id,
  imageUrl,
  title,
  views,
  audioUrl,
  author,
}: PodcastRowProps) => {
  const [duration, setDuration] = useState(1);
  const router = useRouter();
  const { audio, setAudio } = useAudio();

  const handlePlay = () => {
    setAudio({
      title,
      audioUrl,
      imageUrl,
      author,
      podcastId: id,
    });
  };

  const handleViews = () => {
    console.log("views");
    router.push(`/podcasts/${id}`, { scroll: true });
  };
  return (
    <div className="flex items-center w-full gap-12">
      <figure className="cursor-pointer" onClick={handleViews}>
        <Image
          src={imageUrl}
          alt={title}
          width={80}
          height={80}
          className="aspect-square h-fit w-full rounded-lg md:size-[80px]"
        />
      </figure>
      <h2
        className="flex-1 text-16 truncate font-semibold text-white-1 cursor-pointer hover:underline"
        title={title}
        onClick={handleViews}
      >
        {title}
      </h2>
      <p className="text-12 flex items-center gap-2 font-normal truncate capitalize text-white-4">
        <Image
          src="/icons/headphone.svg"
          alt="podcast cover"
          width={24}
          height={24}
        />
        {views}
      </p>
      {audioUrl && (
        <audio
          src={audioUrl}
          className="hidden"
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
          }}
        />
      )}

      <p className="text-12 flex items-center gap-2 font-normal truncate capitalize text-white-4">
        <Clock size={20} />
        {formatTime(duration)}
      </p>
      <Button onClick={() => handlePlay()}>
        <Play size={24} className="text-orange-1" />
      </Button>
    </div>
  );
};

export default PodcastRow;
