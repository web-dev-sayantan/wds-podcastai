"use client";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Home() {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden ">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="podcast_grid">
          {trendingPodcasts?.map(({ _id, imageUrl, title, description }) => (
            <PodcastCard
              key={_id}
              id={_id.toString()}
              imgURL={imageUrl}
              title={title}
              description={description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
