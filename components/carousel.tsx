import { memo } from "react";
import dynamic from "next/dynamic";
import { CarouselProps } from "./flickity";

// Dynamic import to circumvent the "window not defined error"
const Flickity = dynamic(
  () => {
    return import("./flickity");
  },
  { ssr: false }
);

function Carousel({ images, setCurrentIndex, initialIndex }: CarouselProps) {
  return (
    <div className="w-full animate-fadeinslow">
      <Flickity
        setCurrentIndex={setCurrentIndex}
        images={images}
        initialIndex={initialIndex}
      />
    </div>
  );
}

// Memo as only needs to change if images changes
// - else React will render when index changes
// - not guaranteed behaviour, so initialIndex is needed
// -- in case of rerender
export default memo(Carousel, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.images) == JSON.stringify(nextProps.images);
});
