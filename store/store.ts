import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { createWrapper } from "next-redux-wrapper";
import watchListSlice, { WatchListState } from "./slices/watchListSlice";
import ratingsSlice, { RatingsState } from "./slices/ratingsSlice";

const logger = createLogger();

export interface RootState {
  watchList: WatchListState;
  ratings: RatingsState;
}

const makeStore = () =>
  configureStore({
    devTools: true,
    middleware: [logger],
    reducer: {
      watchList: watchListSlice.reducer,
      ratings: ratingsSlice.reducer,
    },
  });

export const wrapper = createWrapper(makeStore);
export type AppStore = ReturnType<typeof makeStore>;
