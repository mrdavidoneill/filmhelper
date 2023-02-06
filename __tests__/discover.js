const GOOD_SEARCH_FILMS = require("@/shared/api_examples/movie_search.json");
const BAD_SEARCH_FILMS = require("@/shared/api_examples/movie_search_error.json");
const GOOD_FILM_INFO = require("@/shared/api_examples/movie_info.json");

import "@testing-library/jest-dom";

import React from "react";
import { render, act, fireEvent, waitFor } from "@testing-library/react";
import { getFilmInfo, searchFilms } from "@/shared/api";
import DiscoverPage from "@/pages/discover";

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
  };
});
const localStorageMock = {
  getItem: jest.fn().mockReturnValue("token"),
};

describe("DiscoverPage", () => {
  it("renders without error", () => {
    global.localStorage = localStorageMock;
    const { asFragment } = render(<DiscoverPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("handles search and sets items", async () => {
    global.localStorage = localStorageMock;
    const { getByPlaceholderText, getByText } = render(<DiscoverPage />);

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
    global.localStorage = localStorageMock;
    const { getByPlaceholderText, getByText } = render(<DiscoverPage />);

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
