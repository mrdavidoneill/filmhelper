import "@testing-library/jest-dom";

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import FilmInfo from "@/components/filminfo";
import { renderWithProviders } from "@/shared/testUtils";

const film = {
  Title: "The Matrix",
  Genre: "Action, Sci-Fi",
  Runtime: "2h 16min",
  Rated: "R",
  Actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
  Plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
};

describe("FilmInfo", () => {
  it("matches snapshot", () => {
    const { container } = renderWithProviders(<FilmInfo film={film} />);
    expect(container).toMatchSnapshot();
  });

  it("displays the correct film information", () => {
    const film = {
      Title: "The Matrix",
      Genre: "Action, Sci-Fi",
      Runtime: "2h 16min",
      Rated: "R",
      Actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
      Plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    };

    const { getByText } = renderWithProviders(<FilmInfo film={film} />);

    expect(getByText(film.Title)).toBeInTheDocument();
    expect(getByText(film.Genre)).toBeInTheDocument();
    expect(getByText(`${film.Runtime} | ${film.Rated}`)).toBeInTheDocument();
    expect(getByText(film.Actors)).toBeInTheDocument();
    expect(getByText(film.Plot)).toBeInTheDocument();
  });

  it("has the add to watchlist button", () => {
    const { getByText } = renderWithProviders(<FilmInfo film={film} />);
    expect(getByText("Add to watchlist")).toBeInTheDocument();
  });

  it("add to watchlist button is clickable", () => {
    const { getByText } = renderWithProviders(<FilmInfo film={film} />);
    fireEvent.click(getByText("Add to watchlist"));
    // Add assertions here to check the behavior after clicking the button
  });
});
