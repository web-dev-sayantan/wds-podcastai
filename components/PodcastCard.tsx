"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface PodcastCardProps {
  id: string;
  imgURL: string;
  title: string;
  description: string;
}

const PodcastCard = ({ id, imgURL, title, description }: PodcastCardProps) => {
  const router = useRouter();
  const handleViews = () => {
    console.log("views");
    router.push(`/podcasts/${id}`, { scroll: true });
  };
  return (
    <div
      className="cursor-pointer flex flex-col gap-2 max-w-[220px]"
      onClick={handleViews}
    >
      <figure className="flex flex-col gap-2">
        <Image
          src={imgURL}
          alt={title}
          width={174}
          height={174}
          className="aspect-square h-fit w-full rounded-lg md:size-[200px]"
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h2
          className="text-16 truncate font-semibold text-white-1"
          title={title}
        >
          {title}
        </h2>
        <p
          className="text-12 font-normal truncate capitalize text-white-4"
          title={description}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default PodcastCard;
