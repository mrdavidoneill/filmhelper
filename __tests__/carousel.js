import "@testing-library/jest-dom";

import React from "react";
import { render, waitFor } from "@testing-library/react";
import Carousel from "@/components/carousel";

describe("Carousel", () => {
  it("should match the snapshot", async () => {
    const images = ["image1.jpg", "image2.jpg"];
    const setCurrentIndex = jest.fn();
    const initialIndex = 0;

    const { container, getByTestId } = render(
      <Carousel
        images={images}
        setCurrentIndex={setCurrentIndex}
        initialIndex={initialIndex}
      />
    );

    await waitFor(() => {
      expect(getByTestId("image1.jpg")).toBeInTheDocument();
      expect(getByTestId("image2.jpg")).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
