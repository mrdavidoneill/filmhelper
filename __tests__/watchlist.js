import "@testing-library/jest-dom";

import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import WatchListPage from "@/pages/watchlist";
import { renderWithProviders } from "@/shared/testUtils";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/shared/api", () => ({
  getFilmWatchList: jest.fn().mockResolvedValue({
    results: [{ imdb_id: "tt1270797" }],
  }),
}));

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({ Title: "Inception" }),
});

const localStorageMock = {
  getItem: jest.fn().mockReturnValue("token"),
};

describe("WatchListPage", () => {
  it("renders without error", () => {
    global.localStorage = localStorageMock;
    const { asFragment } = renderWithProviders(<WatchListPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders error if not logged in", () => {
    global.localStorage = {
      getItem: jest.fn().mockReturnValue(null),
    };
    const { getByText } = renderWithProviders(<WatchListPage />);
    expect(getByText("Error: Not currently logged in")).toBeInTheDocument();
  });
});
