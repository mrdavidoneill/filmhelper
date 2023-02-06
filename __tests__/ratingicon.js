import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RatingIcon from "@/components/ratingicon";

describe("MuiRating component", () => {
  it("should have the right value when the rating is changed", () => {
    const { getByLabelText } = render(<RatingIcon stars={3} />);
    expect(getByLabelText("4.5 Stars").checked).toBe(false);
    fireEvent.click(getByLabelText("3 Stars"));
    expect(getByLabelText("3 Stars").checked).toBe(true);
    fireEvent.click(getByLabelText("4.5 Stars"));
    expect(getByLabelText("4.5 Stars").checked).toBe(true);
  });
});
