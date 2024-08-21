import Image from "next/image";
import React from "react";

interface PodcastCardProps {
  id: number;
  imgURL: string;
  title: string;
  description: string;
}

const PodcastCard = ({ id, imgURL, title, description }: PodcastCardProps) => {
  return (
    <div className="cursor-pointer flex flex-col gap-2">
      <figure className="flex flex-col gap-2">
        <Image
          src={imgURL}
          alt={title}
          width={174}
          height={174}
          className="aspect-square h-fit w-full rounded-lg 2xl:size-[200px]"
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h2 className="text-16 truncate font-semibold text-white-1">{title}</h2>
        <p className="text-12 font-normal truncate capitalize text-white-4">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PodcastCard;
