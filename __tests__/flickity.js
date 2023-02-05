import React from "react";
import { render } from "@testing-library/react";
import Carousel from "../components/flickity";

describe("Carousel", () => {
  it("should match the snapshot", () => {
    const images = ["image1.jpg", "image2.jpg"];
    const setCurrentIndex = jest.fn();
    const initialIndex = 0;

    const { container } = render(
      <Carousel
        images={images}
        setCurrentIndex={setCurrentIndex}
        initialIndex={initialIndex}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
