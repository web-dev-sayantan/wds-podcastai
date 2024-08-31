"use client";
import React from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import PodcastDetailsPlayer from "@/components/PodcastDetailsPlayer";
import PodcastCard from "@/components/PodcastCard";
import LoaderSpinner from "@/components/LoaderSpinner";
import EmptyState from "@/components/EmptyState";
import { useUser } from "@clerk/nextjs";

export default function PodcastDetails({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) {
  const { user } = useUser();
  const podcast = useQuery(api.podcasts.getPodcastbyId, {
    podcastId: podcastId,
  });
  const similarPodcasts = useQuery(api.podcasts.getPodcastsByVoiceType, {
    podcastId: podcastId,
  });
  if (!podcast || !similarPodcasts) return <LoaderSpinner />;

  const isOwner = user?.id === podcast.authorId;
  return (
    <section className="flex flex-col w-full">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-white-1 text-2xl font-bold">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            alt="podcast cover"
            width={24}
            height={24}
          />
          <h2 className="text-white-1 text-16 font-bold ">{podcast?.views}</h2>
        </figure>
      </header>
      <PodcastDetailsPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        {...podcast}
      />
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.description}
      </p>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-white-1 text-18 font-bold">Transcript</h1>
          <p className="text-white-2 text-16 font-medium">
            {podcast?.voicePrompt}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-white-1 text-18 font-bold">Thumbnail Prompt</h1>
          <p className="text-white-2 text-16 font-medium">
            {podcast?.imagePrompt}
          </p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
        <div className="flex flex-col md:flex-row gap-4">
          {similarPodcasts?.length > 0 ? (
            similarPodcasts?.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                id={podcast._id}
                imgURL={podcast.imageUrl}
                title={podcast.title}
                description={podcast.description}
              />
            ))
          ) : (
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          )}
        </div>
      </section>
    </section>
  );
}
