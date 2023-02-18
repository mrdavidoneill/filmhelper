const GOOD_SEARCH_FILMS = require("@/shared/api_examples/movie_search.json");
const BAD_SEARCH_FILMS = require("@/shared/api_examples/movie_search_error.json");
const GOOD_FILM_INFO = require("@/shared/api_examples/movie_info.json");
const GOOD_WATCHLIST = require("@/shared/api_examples/get_watchlist.json");
const GOOD_RATINGS = require("@/shared/api_examples/get_ratings.json");
const SAMPLE_FILMS = require("@/shared/api_examples/backup_movie.json");

import "@testing-library/jest-dom";

import React from "react";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { getFilmInfo, searchFilms } from "@/shared/api";
import DiscoverPage from "@/pages/discover";
import { renderWithProviders } from "@/shared/testUtils";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/shared/api", () => {
  return {
    searchFilms: jest.fn((input) => {
      if (input.length > 2) {
        return Promise.resolve(GOOD_SEARCH_FILMS);
      } else {
        return Promise.resolve(BAD_SEARCH_FILMS);
      }
    }),
    getFilmInfo: jest.fn(() => {
      return Promise.resolve(GOOD_FILM_INFO);
    }),
    getFilmWatchList: jest.fn(() => {
      return Promise.resolve(GOOD_WATCHLIST);
    }),
    getFilmRatings: jest.fn(() => {
      return Promise.resolve(GOOD_RATINGS);
    }),
  };
});
Storage.prototype.getItem = jest.fn().mockReturnValue("A TOKEN");

describe("DiscoverPage", () => {
  it("renders without error", async () => {
    const { asFragment, getByRole, getByTestId } = renderWithProviders(
      <DiscoverPage />
    );
    await waitFor(() => {
      expect(getByRole("progressbar")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(getByTestId(SAMPLE_FILMS[0].Poster)).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("handles search and sets items", async () => {
    const { getByPlaceholderText } = renderWithProviders(<DiscoverPage />);

    const input = getByPlaceholderText("Search…");
    act(() => {
      fireEvent.change(input, { target: { value: "Rocky" } });
    });
    act(() => {
      fireEvent.keyDown(input, { key: "Enter", code: 13 });
    });
    await waitFor(() => {
      expect(searchFilms).toHaveBeenCalledWith("Rocky");
    });
    await waitFor(() => {
      expect(getFilmInfo).toHaveBeenCalledWith(
        GOOD_SEARCH_FILMS.Search[0].imdbID
      );
    });
  });

  it("handles no search results", async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <DiscoverPage />
    );

    const input = getByPlaceholderText("Search…");
    act(() => {
      fireEvent.change(input, { target: { value: "A" } });
    });
    act(() => {
      fireEvent.keyDown(input, { key: "Enter", code: 13 });
    });
    await waitFor(() => {
      expect(searchFilms).toHaveBeenCalledWith("A");
    });

    await waitFor(() => {
      expect(getByText(/Error/)).toBeInTheDocument();
    });
  });
});
