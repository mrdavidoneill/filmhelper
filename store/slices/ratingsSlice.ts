import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilmRatingsType } from "@/shared/types";
import { RootState } from "../store";

export interface RatingsState {
  [imdbID: string]: FilmRatingsType;
}

export const ratingsSlice = createSlice({
  name: "ratings",
  initialState: {} as RatingsState,
  reducers: {
    addToRatings: (state, action: PayloadAction<FilmRatingsType>) => {
      state[action.payload.imdb_id] = action.payload;
    },
    removeFromRatings: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    initializeRatingss: (state, action: PayloadAction<FilmRatingsType[]>) => {
      action.payload.forEach((film) => {
        state[film.imdb_id] = film;
      });
    },
  },
});

export default ratingsSlice;
export const selectRatings = (state: RootState) => state.ratings;
