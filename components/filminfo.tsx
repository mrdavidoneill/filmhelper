import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FilmInfoType } from "@/shared/types";
import { CardHeader } from "@mui/material";
import RatingIcon from "@/components/ratingicon";

export default function FilmInfo({ film }: { film: FilmInfoType }) {
  return (
    <Card className="h-full self-center w-full max-w-3xl overflow-y-auto">
      <CardActions>
        <Button variant="outlined" className="self-center w-full" size="small">
          Add to watchlist
        </Button>
      </CardActions>
      <CardHeader
        className="pb-0"
        title={film?.Title}
        subheader={film?.Genre}
        action={<RatingIcon stars={5} />}
      ></CardHeader>

      <CardContent className="pt-0">
        <Typography variant="body2" color="text.secondary">
          {film?.Runtime} | {film?.Rated}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {film?.Actors}
        </Typography>
        <Typography variant="body2">{film?.Plot}</Typography>
      </CardContent>
    </Card>
  );
}
