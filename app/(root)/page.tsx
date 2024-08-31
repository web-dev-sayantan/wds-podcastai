"use client";
import PodcastCard from "@/components/PodcastCard";
import PodcastRow from "@/components/PodcastRow";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Home() {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const latestPodcasts = useQuery(api.podcasts.getLatestPodcasts);
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
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Latest Podcasts</h1>
        <div className="flex flex-col w-full gap-y-6">
          {latestPodcasts?.map(
            ({ _id, imageUrl, title, views, audioUrl, author }, index) => (
              <>
                <PodcastRow
                  key={_id}
                  id={_id.toString()}
                  imageUrl={imageUrl}
                  author={author}
                  title={title}
                  views={views}
                  audioUrl={audioUrl!}
                />
                {index !== latestPodcasts.length - 1 ? (
                  <Separator className="w-full bg-slate-700" />
                ) : null}
              </>
            )
          )}
        </div>
      </section>
    </div>
  );
}
