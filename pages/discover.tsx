import Head from "next/head";
import { Inter } from "@next/font/google";
import SearchAppBar from "@/components/searchbar";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import Carousel from "@/components/carousel";
import FilmInfo from "@/components/filminfo";
import {
  FilmInfoType,
  FilmSearchType,
  FilmWatchListType,
} from "@/shared/types";
import { Alert, CircularProgress, ThemeProvider } from "@mui/material";
import { theme } from "@/shared/theme";
import BottomNavBar from "@/components/bottomnav";
import { getFilmInfo, getFilmWatchList, searchFilms } from "@/shared/api";
import { useSelector, useDispatch } from "react-redux";
import watchListSlice, { selectWatchList } from "@/store/slices/watchListSlice";

const SAMPLE_FILMS = require("@/shared/api_examples/backup_movie.json");
const SAMPLE_SEARCH_FILMS = require("@/shared/api_examples/movie_search.json");

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dispatch = useDispatch();

  const [randomIndex, setRandomIndex] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<FilmInfoType[] | FilmSearchType[]>(
    SAMPLE_FILMS.slice(randomIndex, randomIndex + 10)
  );
  const [error, setError] = useState("");
  const [dismissError, setDismissError] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function getWatchList(token: string) {
      setIsLoading(true);
      const filmwatchlist: FilmWatchListType[] = await fetchFilmWatchList(
        token
      );
      // Fetch all films in filmwatchlist
      filmwatchlist.forEach(async (film, index) => {
        dispatch(watchListSlice.actions.addToWatchList(film));
      });
      setIsLoading(false);
    }
    const token = localStorage.getItem("token");
    if (token) {
      getWatchList(token);
    } else {
      handleSetError("Not currently logged in");
    }
  }, []);

  async function fetchFilmWatchList(
    token: string
  ): Promise<FilmWatchListType[]> {
    try {
      const response = await getFilmWatchList(token);
      return response.results;
    } catch (error) {
      handleSetError("Couldn't reach server");
      return [];
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const filmInfo = await getFilmInfo(items[currentIndex].imdbID);
        setItems((prev) => {
          const clone = [...prev];
          clone[currentIndex] = filmInfo;
          return clone;
        });
      } catch (error) {
        setError(JSON.stringify(error));
      }
    }
    if (items.length > 0 && !(items[currentIndex] as FilmInfoType).Plot) {
      fetchData();
    }
  }, [currentIndex, items]);

  function handleChangeIndex(index: number) {
    setCurrentIndex(index);
  }

  function handleSetError(error: string) {
    setDismissError(false);
    setError(error);
  }

  const handleSearch = async () => {
    setIsLoading(true);
    handleSetError("");
    setItems([]);

    try {
      const data = await searchFilms(input);
      if (data.Response === "True") {
        setIsLoading(false);
        setItems(
          data.Search.filter((film: FilmSearchType) => film.Poster !== "N/A")
        );
      } else {
        setError(data.Error);
      }
    } catch (error) {
      setIsLoading(false);
      setError(JSON.stringify(error));
    }
  };

  const handleEnter = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleType = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(event.target.value);
  };

  const handleDismissError = () => {
    setDismissError(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Film Helper</title>
        <meta
          name="description"
          content="Web app to help organise your watchlist"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col bg-slate-300 h-[100vh] overflow-hidden animate-fadein">
        {error && !dismissError && (
          <Alert severity="error" onClose={handleDismissError}>
            {`Error: ${error}`}
          </Alert>
        )}
        <SearchAppBar
          value={input}
          onChange={handleType}
          onKeyDown={handleEnter}
        />
        {isLoading ? (
          <div className="flex flex-col flex-1 justify-center m-auto">
            <CircularProgress />
          </div>
        ) : (
          <Fragment>
            <Carousel
              setCurrentIndex={handleChangeIndex}
              images={items
                .slice(0, 20)
                .map((film: { Poster: string }) => film.Poster)}
              initialIndex={currentIndex}
            />
            {(items[currentIndex] as FilmInfoType)?.Plot && (
              <div className="flex flex-col flex-1 overflow-y-auto animate-risefast">
                <FilmInfo film={items[currentIndex] as FilmInfoType} />
              </div>
            )}
          </Fragment>
        )}
        <BottomNavBar />
      </div>
    </ThemeProvider>
  );
}
