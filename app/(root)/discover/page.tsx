"use client";

import EmptyState from "@/components/EmptyState";
import PodcastCard from "@/components/PodcastCard";
import SearchBar from "@/components/SearchBar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Discover = ({
  searchParams: { search },
}: {
  searchParams: { search?: string };
}) => {
  const podcasts = useQuery(api.podcasts.getPodcastBySearch, {
    query: search || "",
  });

  return (
    <div className="flex flex-col gap-9">
      <SearchBar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trending Podcasts" : "Search results for "}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcasts ? (
          <>
            <div className="podcast_grid">
              {podcasts.map((podcast) => (
                <PodcastCard
                  id={podcast._id}
                  imgURL={podcast.imageUrl}
                  title={podcast.title}
                  description={podcast.description}
                  key={podcast._id}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="No results" />
        )}
      </div>
    </div>
  );
};

export default Discover;
