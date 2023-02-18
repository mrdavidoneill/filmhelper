const Flickity = require("react-flickity-component");

interface RefProps {
  on: Function;
  select: Function;
  selectedIndex: number;
}

export interface CarouselProps {
  images: string[];
  setCurrentIndex: Function;
  initialIndex: number;
}

function flickityRef(ref: RefProps, setCurrentIndex: Function) {
  ref.on("change", (index: number) => setCurrentIndex(index));
  ref.on(
    "staticClick",
    (
      _event: object,
      _pointer: object,
      _cellElement: object,
      cellIndex: number
    ) => ref.select(cellIndex)
  );
}

export default function Carousel({
  images,
  setCurrentIndex,
  initialIndex,
}: CarouselProps) {
  const flickityOptions = {
    wrapAround: images.length > 3,
    setGallerySize: true,
    pageDots: false,
    prevNextButtons: false,
    selectedAttraction: 0.02,
    friction: 0.2,
    draggable: ">2",
    initialIndex: initialIndex,
  };

  if (images.length > 0) {
    return (
      <Flickity
        flickityRef={(ref: RefProps) => flickityRef(ref, setCurrentIndex)}
        className={"bg-black cursor-pointer outline-white"} // default ''
        elementType={"div"} // default 'div'
        options={flickityOptions}
        disableImagesLoaded={true} // default false
        reloadOnUpdate={true} // default false
        static={false} // default false
      >
        {images.map((image, index) => (
          <div
            key={`${image}:${index}`}
            data-testid={image}
            className=" flex flex-grow mx-2 h-[35vh] w-[30vh] max-w-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </Flickity>
    );
  } else {
    return (
      <div className={"bg-black flex justify-center "}>
        <div className="text-white justify-center items-center flex mx-2 h-[35vh] w-[30vh] max-w-sm bg-cover bg-center">
          {/* No items to show */}
        </div>
      </div>
    );
  }
}
