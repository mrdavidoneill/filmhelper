import "@testing-library/jest-dom";
import React from "react";
import Loading from "@/components/loading";
import { render, screen } from "@testing-library/react";

describe("Loading", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<Loading />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders a circular progress indicator", () => {
    render(<Loading />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
