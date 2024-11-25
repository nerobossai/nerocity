import "@/styles/global.scss";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

import useUserStore from "@/stores/useUserStore";
import { tailwindConfig } from "@/styles/global";
import { tabsTheme } from "@/styles/tabsTheme";
import type { ProfileObject } from "@/utils/AuthUtils";
import { getProfileFromStorage } from "@/utils/AuthUtils";
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const theme = extendTheme({
  colors: tailwindConfig.theme?.colors,
  components: {
    Tabs: tabsTheme,
    Button: {
      baseStyle: {
        borderRadius: "0",
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: "0",
          },
        },
        filled: {
          field: {
            borderRadius: "0",
          },
        },
        flushed: {
          field: {
            borderRadius: "0",
          },
        },
        unstyled: {
          field: {
            borderRadius: "0",
          },
        },
      },
    },
  },
  fonts: {
    body: "JetBrains Mono",
    heading: "JetBrains Mono",
    text: "JetBrains Mono",
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { setAuthenticated, setToken, setUserProfile } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const profile: ProfileObject | null = getProfileFromStorage();

      if (!profile) {
        setIsMounted(true);
        return;
      }

      setUserProfile(profile);
      setAuthenticated(true);
      setToken(profile.token);
      setIsMounted(true);
    } catch (err) {
      setIsMounted(true);
    }
  }, []);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <ChakraProvider theme={theme}>
          <Head>
            <link
              href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
              rel="stylesheet"
            />
          </Head>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default MyApp;
