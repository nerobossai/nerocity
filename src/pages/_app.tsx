import "@/styles/global.scss";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import type { AppProps } from "next/app";
import { useEffect, useMemo } from "react";

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
  },
  fonts: {
    body: "Tsukimi Rounded",
    heading: "Tsukimi Rounded",
    text: "Tsukimi Rounded",
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { setAuthenticated, setToken, setUserProfile } = useUserStore();

  useEffect(() => {
    const profile: ProfileObject | null = getProfileFromStorage();

    if (!profile) return;

    setUserProfile(profile);
    setAuthenticated(true);
    setToken(profile.token);
  }, []);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
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
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default MyApp;
