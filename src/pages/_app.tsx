import "@/styles/global.scss";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

import useUserStore from "@/stores/useUserStore";
import { tailwindConfig } from "@/styles/global";
import { tabsTheme } from "@/styles/tabsTheme";
import type { ProfileObject } from "@/utils/AuthUtils";
import { getProfileFromStorage } from "@/utils/AuthUtils";
import { RPC_NODE_URL } from "@/constants/platform";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
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

  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => RPC_NODE_URL || clusterApiUrl(network), [network]);

  const wallets = useMemo(() => {
    const availableWallets = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new BackpackWalletAdapter(),
    ];

    return availableWallets;
  }, [network]);

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
