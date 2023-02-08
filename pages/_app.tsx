import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { wrapper } from "@/store/store";
import { StyledEngineProvider } from "@mui/material/styles";

export default function App({ Component, ...rest }: AppProps) {
  const { store } = wrapper.useWrappedStore(rest);
  const { pageProps = {} } = rest;
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <Component {...pageProps} />
      </StyledEngineProvider>
    </Provider>
  );
}
