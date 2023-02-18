import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FilmInfoType } from "@/shared/types";
import { CardHeader } from "@mui/material";
import RatingIcon from "@/components/ratingicon";
import {
  deleteRatings,
  deleteWatchList,
  postRatings,
  postWatchList,
  putRatings,
} from "@/shared/api";
import { useSelector, useDispatch } from "react-redux";
import watchListSlice, { selectWatchList } from "@/store/slices/watchListSlice";
import ratingsSlice, { selectRatings } from "@/store/slices/ratingsSlice";

export default function FilmInfo({ film }: { film: FilmInfoType }) {
  const watchListState = useSelector(selectWatchList);
  const ratingsState = useSelector(selectRatings);
  const dispatch = useDispatch();

  async function handleAddToWatchList() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await postWatchList({ imdbID: film.imdbID, token });
        dispatch(watchListSlice.actions.addToWatchList(response));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemoveFromWatchList() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await deleteWatchList({ id: watchListState[film.imdbID].id, token });
        dispatch(watchListSlice.actions.removeFromWatchList(film.imdbID));
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleRatingChange(value: number) {
    if (film.imdbID in ratingsState) {
      value ? putRatingChange(value) : deleteRating();
    } else {
      postRatingChange(value);
    }
  }

  async function postRatingChange(value: number) {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await postRatings({
          rating: value,
          imdbID: film.imdbID,
          token,
        });
        dispatch(ratingsSlice.actions.addToRatings(response));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function putRatingChange(value: number) {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await putRatings({
          id: ratingsState[film.imdbID].id,
          rating: value,
          imdbID: film.imdbID,
          token,
        });
        dispatch(ratingsSlice.actions.addToRatings(response));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteRating() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await deleteRatings({ id: ratingsState[film.imdbID].id, token });
        dispatch(ratingsSlice.actions.removeFromRatings(film.imdbID));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className="h-full self-center w-full max-w-3xl overflow-y-auto animate-fadein">
      <CardActions>
        {film?.imdbID in watchListState ? (
          <Button
            variant="outlined"
            className="self-center w-full"
            size="small"
            onClick={handleRemoveFromWatchList}
          >
            Remove from watchlist
          </Button>
        ) : (
          <Button
            variant="contained"
            className="self-center w-full"
            size="small"
            onClick={handleAddToWatchList}
          >
            Add to watchlist
          </Button>
        )}
      </CardActions>
      <CardHeader
        className="pb-0"
        title={film?.Title}
        subheader={film?.Genre}
        action={
          <RatingIcon
            onChange={handleRatingChange}
            percentage={ratingsState[film.imdbID]?.rating || 0}
          />
        }
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
