const GOOD_FILM_INFO = require("@/shared/api_examples/movie_info.json");
const GOOD_WATCHLIST = require("@/shared/api_examples/get_watchlist.json");
import "@testing-library/jest-dom";

import React from "react";
import { waitFor } from "@testing-library/react";
import { getFilmWatchList, getFilmInfo } from "@/shared/api";
import WatchListPage from "@/pages/watchlist";
import { renderWithProviders } from "@/shared/testUtils";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/shared/api", () => {
  return {
    getFilmWatchList: jest.fn(() => {
      return Promise.resolve(GOOD_WATCHLIST);
    }),
    getFilmInfo: jest.fn(() => {
      return Promise.resolve(GOOD_FILM_INFO);
    }),
  };
});

Storage.prototype.setItem = jest.fn();
Storage.prototype.getItem = jest.fn().mockReturnValue("A TOKEN");

describe("WatchListPage", () => {
  it("renders without error", async () => {
    const { asFragment, queryByText } = renderWithProviders(<WatchListPage />);

    expect(localStorage.getItem).toHaveBeenCalledWith("token");
    expect(getFilmWatchList).toHaveBeenCalled();

    await waitFor(() => {
      expect(getFilmInfo).toHaveBeenCalled();
    });
    expect(
      queryByText("Error: Not currently logged in")
    ).not.toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders error if not logged in", () => {
    Storage.prototype.getItem = jest.fn().mockReturnValue(null);

    const { getByText } = renderWithProviders(<WatchListPage />);
    expect(getByText("Error: Not currently logged in")).toBeInTheDocument();
  });
});
