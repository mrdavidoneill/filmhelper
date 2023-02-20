export interface FilmInfoType {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [
    {
      Source: string;
      Value: string;
    },
    {
      Source: string;
      Value: string;
    },
    {
      Source: string;
      Value: string;
    }
  ];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: "True" | "False";
}

export interface FilmSearchType {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface FilmWatchListType {
  id: number;
  user: string;
  imdb_id: string;
  date_added: string;
}

export interface FilmSearchResponseGoodType {
  Search: FilmSearchType[];
  totalResults: string;
  Response: "True";
}

export interface FilmSearchResponseBadType {
  Error: string;
  Response: "False";
}

export type FilmSearchResponseType =
  | FilmSearchResponseGoodType
  | FilmSearchResponseBadType;

export interface FilmRatingsType {
  id: number;
  rating: number;
  user: string;
  imdb_id: string;
  date_added: string;
}
