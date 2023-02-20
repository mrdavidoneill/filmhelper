import React, { SyntheticEvent } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const NUMBER_OF_STARS = 5;
const conversionRate = 100 / NUMBER_OF_STARS;

function percentageToStars(percentage = 0) {
  return percentage / conversionRate;
}

function starsToPercentage(stars = 0) {
  return stars * conversionRate;
}

interface Props {
  percentage: number;
  onChange: (value: number) => void;
}

export default function RatingIcon({ percentage, onChange }: Props) {
  function handleChange(
    _event: SyntheticEvent<Element, Event>,
    value: number | null
  ) {
    onChange(starsToPercentage(value || 0));
  }
  return (
    <Stack spacing={1}>
      <Rating
        name="half-rating"
        value={percentageToStars(percentage)}
        precision={0.5}
        onChange={handleChange}
      />
    </Stack>
  );
}
