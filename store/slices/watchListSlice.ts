import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilmWatchListType } from "@/shared/types";
import { RootState } from "../store";

export interface WatchListState {
  [imdbID: string]: FilmWatchListType;
}

export const watchListSlice = createSlice({
  name: "watchList",
  initialState: {} as WatchListState,
  reducers: {
    addToWatchList: (state, action: PayloadAction<FilmWatchListType>) => {
      state[action.payload.imdb_id] = action.payload;
    },
    removeFromWatchList: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    initializeWatchLists: (
      state,
      action: PayloadAction<FilmWatchListType[]>
    ) => {
      action.payload.forEach((film) => {
        state[film.imdb_id] = film;
      });
    },
  },
});

export default watchListSlice;
export const selectWatchList = (state: RootState) => state.watchList;
