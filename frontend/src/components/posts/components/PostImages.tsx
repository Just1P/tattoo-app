"use client";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";

interface PostImagesProps {
  images: string[];
}

export function PostImages({ images }: PostImagesProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) return null;

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  // Si une seule image, affichage simple
  if (images.length === 1) {
    return (
      <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
        {imageErrors.has(0) ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500 text-sm">Image non disponible</span>
          </div>
        ) : (
          <Image
            src={images[0]}
            alt="Post image"
            fill
            className="object-cover"
            onError={() => handleImageError(0)}
            unoptimized
          />
        )}
      </div>
    );
  }

  // Si plusieurs images, utiliser le carousel
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card className="border-0">
              <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                {imageErrors.has(index) ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      Image non disponible
                    </span>
                  </div>
                ) : (
                  <Image
                    src={image}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(index)}
                    unoptimized
                  />
                )}
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />

      {/* Indicateur de position */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
        {images.length} photos
      </div>
    </Carousel>
  );
}
