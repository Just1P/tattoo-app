interface PostImagesProps {
  images: string[];
}

export function PostImages({ images }: PostImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <span className="text-gray-500 text-sm">Image non disponible</span>
        </div>
      ))}
    </div>
  );
}
