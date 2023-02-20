import Head from "next/head";
import SearchAppBar from "@/components/searchbar";
import { ChangeEvent, useEffect, useState } from "react";
import Carousel from "@/components/carousel";
import FilmInfo from "@/components/filminfo";
import { FilmInfoType, FilmWatchListType } from "@/shared/types";
import { Alert, CircularProgress, ThemeProvider } from "@mui/material";
import { theme } from "@/shared/theme";
import BottomNavBar from "@/components/bottomnav";
import { getFilmInfo, getFilmWatchList } from "@/shared/api";
import { useSelector, useDispatch } from "react-redux";
import watchListSlice, { selectWatchList } from "@/store/slices/watchListSlice";

export default function WatchListPage() {
  const state = useSelector(selectWatchList);
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<FilmInfoType[]>([]);
  const [input, setInput] = useState("");
  const [filteredItems, setFilteredItems] = useState<FilmInfoType[]>([]);
  const [error, setError] = useState("");
  const [dismissError, setDismissError] = useState(false);

  useEffect(() => {
    setFilteredItems(
      items
        .filter((film) => film.imdbID in state)
        .filter((item) =>
          item.Title.toLowerCase().includes(input.toLowerCase())
        )
    );
  }, [input, items, state]);

  useEffect(() => {
    async function getWatchList(token: string) {
      setIsLoading(true);
      const filmList: FilmWatchListType[] = await fetchFilmWatchList(token);
      const filmInfoList = await Promise.all(
        filmList.map(async (film) => {
          return await fetchFilmInfo(film.imdb_id);
        })
      );
      // Remove any items who's fetchInfo failed
      setItems(filmInfoList.filter((filmInfo) => filmInfo) as FilmInfoType[]);
      filmList.forEach((film) => {
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

  async function fetchFilmInfo(imdbID: string) {
    try {
      const filmInfo = await getFilmInfo(imdbID);
      return filmInfo;
    } catch (error) {
      handleSetError(JSON.stringify(error));
      return null;
    }
  }

  function handleChangeIndex(index: number) {
    setCurrentIndex(index);
  }

  function handleSetError(error: string) {
    setDismissError(false);
    setError(error);
  }

  const handleEnter = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      console.log("ENTER");
    }
  };

  const handleType = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(event.target.value);
    setCurrentIndex(0);
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
        {isLoading && (
          <div className="flex flex-col flex-1 justify-center m-auto">
            <CircularProgress />
          </div>
        )}
        <Carousel
          setCurrentIndex={handleChangeIndex}
          images={filteredItems.map((film: { Poster: string }) => film.Poster)}
          initialIndex={currentIndex}
        />
        <div className="flex flex-col flex-1 overflow-y-auto animate-risefast">
          {filteredItems.length > 0 && (
            <FilmInfo film={filteredItems[currentIndex]} />
          )}
        </div>
        <BottomNavBar />
      </div>
    </ThemeProvider>
  );
}
