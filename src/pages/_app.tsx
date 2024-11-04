import "@/styles/global.scss";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";

import { tailwindConfig } from "@/styles/global";
import { tabsTheme } from "@/styles/tabsTheme";

const theme = extendTheme({
  colors: tailwindConfig.theme?.colors,
  components: {
    Tabs: tabsTheme,
  },
  fonts: {
    body: "Tsukimi Rounded",
    heading: "Tsukimi Rounded",
    text: "Tsukimi Rounded",
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
