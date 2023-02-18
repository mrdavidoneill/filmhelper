import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RatingIcon from "@/components/ratingicon";

describe("MuiRating component", () => {
  it("should display no stars for 0%", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <RatingIcon percentage={0} onChange={onChange} />
    );
    const stars = new Set([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
    for (const star of stars) {
      expect(
        getByLabelText(`${star} Star${star === 1 ? "" : "s"}`).checked
      ).toBe(false);
    }
  });

  it("should display 2.5 stars for 50%", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <RatingIcon percentage={50} onChange={onChange} />
    );
    expect(getByLabelText("2.5 Stars").checked).toBe(true);
  });

  it("should display 5 stars for 100%", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <RatingIcon percentage={100} onChange={onChange} />
    );
    expect(getByLabelText("5 Stars").checked).toBe(true);
  });

  it("should send the right value when the rating is changed", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <RatingIcon percentage={0} onChange={onChange} />
    );
    fireEvent.click(getByLabelText("3.5 Stars"));
    expect(onChange).toHaveBeenCalledWith(3.5 * 20);
  });
});
