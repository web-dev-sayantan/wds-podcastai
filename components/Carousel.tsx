import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import { CarouselProps } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoaderSpinner from "@/components/LoaderSpinner";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel = ({ fansLikeDetails }: CarouselProps) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  const slides = fansLikeDetails?.filter((item) => item.totalPodcasts > 0);

  if (!slides) return <LoaderSpinner />;
  return (
    <section
      className="flex flex-col w-full overflow-hidden gap-4"
      ref={emblaRef}
    >
      <div className="flex">
        {slides.slice(0, 5).map((item) => (
          <figure
            className="carousel_box"
            onClick={() =>
              router.push(`/podcasts/${item.podcast[0].podcastId}`)
            }
            key={item._id}
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="absolute size-full rounded-xl border-none"
            />
            <div className="flex-center flex-col glassmorphism-black relative z-10 rounded-b-xl p-4">
              <h2 className="text-14 font-semibold text-white-1">
                {item.podcast[0].title}
              </h2>
              <p className="text-12 font-normal text-white-2">{item.name}</p>
            </div>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default EmblaCarousel;
