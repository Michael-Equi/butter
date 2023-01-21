import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { Provider } from "urql";
import { client } from "../client/graphql/client";
import Layout from "../client/components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../client/theme";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider value={client}>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </Provider>
    </ChakraProvider>
  );
}

export default CustomApp;
