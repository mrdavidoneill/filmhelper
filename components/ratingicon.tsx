import React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

export default function RatingIcon({ stars }: { stars: number }) {
  return (
    <Stack spacing={1}>
      <Rating name="half-rating" defaultValue={stars} precision={0.5} />
    </Stack>
  );
}
