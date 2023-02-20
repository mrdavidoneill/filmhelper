import {
  FilmInfoType,
  FilmRatingsType,
  FilmSearchResponseType,
  FilmWatchListType,
} from "@/shared/types";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function postAPIRequest({
  body,
  resource,
  token,
}: {
  body: Object;
  resource: string;
  token?: string;
}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${resource}/`, {
      method: "POST",
      headers: token
        ? { ...headers, Authorization: `Token ${token}` }
        : headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateAPIRequest({
  body,
  token,
  resource,
}: {
  body: Object;
  token: string;
  resource: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${resource}/`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAPIRequest({
  token,
  resource,
}: {
  token: string;
  resource: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${resource}/`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAPIRequest({
  token,
  resource,
}: {
  token: string;
  resource: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${resource}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchToken(username: string, password: string) {
  return postAPIRequest({
    body: { username, password },
    resource: "api-token-auth",
  });
}

export async function getFilmWatchList(token: string) {
  return getAPIRequest({
    token,
    resource: "filmwatchlist",
  });
}

export async function searchFilms(
  input: string
): Promise<FilmSearchResponseType> {
  const response = await fetch(
    `http://www.omdbapi.com/?s=${input}&type=movie&apikey=${process.env.NEXT_PUBLIC_OMDB_KEY}`
  );
  return response.json();
}

export async function getFilmInfo(imdbID: string): Promise<FilmInfoType> {
  const response = await fetch(
    `http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.NEXT_PUBLIC_OMDB_KEY}`
  );
  return response.json();
}

export async function postWatchList({
  imdbID,
  token,
}: {
  imdbID: string;
  token: string;
}): Promise<FilmWatchListType> {
  return postAPIRequest({
    body: { imdb_id: imdbID },
    resource: "filmwatchlist",
    token,
  });
}

export async function deleteWatchList({
  id,
  token,
}: {
  id: number;
  token: string;
}) {
  return deleteAPIRequest({
    resource: `filmwatchlist/${id}`,
    token,
  });
}

export async function getFilmRatings(token: string) {
  return getAPIRequest({
    token,
    resource: "filmratings",
  });
}

export async function postRatings({
  rating,
  imdbID,
  token,
}: {
  rating: number;
  imdbID: string;
  token: string;
}): Promise<FilmRatingsType> {
  return postAPIRequest({
    body: { rating, imdb_id: imdbID },
    resource: "filmratings",
    token,
  });
}

export async function putRatings({
  rating,
  id,
  imdbID,
  token,
}: {
  rating: number;
  imdbID: string;
  id: number;
  token: string;
}): Promise<FilmRatingsType> {
  return updateAPIRequest({
    body: { rating, imdb_id: imdbID },
    resource: `filmratings/${id}`,
    token,
  });
}

export async function deleteRatings({
  id,
  token,
}: {
  id: number;
  token: string;
}) {
  return deleteAPIRequest({
    resource: `filmratings/${id}`,
    token,
  });
}
