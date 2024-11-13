import { useBreakpointValue } from "@chakra-ui/react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";

export const ConnectWallet = () => {
  const network = clusterApiUrl("devnet");

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const fontSize = useBreakpointValue({ base: "10px", sm: "12px", md: "16px" });

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton
            style={{
              backgroundColor: "#262A2E",
              color: "white",
              fontFamily: "Tsukimi Rounded",
              justifyContent: "space-around",
              fontSize,
              whiteSpace: "nowrap",
              textAlign: "center",
              padding: "0.5rem 1rem",
              maxWidth: "200px",
            }}
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default ConnectWallet;
