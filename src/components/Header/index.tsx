"use client";

import {
  HStack,
  Link,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { authApiClient } from "@/modules/Home/services/authApiClient";
import useUserStore from "@/stores/useUserStore";
import * as AuthUtils from "@/utils/AuthUtils";

import { Logo } from "../Svgs/Logo";

const Container = styled.header`
  /* max-width: 490px; */
  background-color: #0b0d0e;
`;

function Header() {
  const router = useRouter();
  const {
    isAuthenticated,
    profile,
    reset,
    token,
    setUserProfile,
    setToken,
    setAuthenticated,
  } = useUserStore((state) => state);
  const {
    autoConnect,
    wallets,
    wallet,
    publicKey,
    connecting,
    connected,
    disconnecting,
    connect,
    disconnect,
    signIn,
  } = useWallet();

  const [previousKey, setPreviousKey] = useState<string | undefined>(
    publicKey?.toString(),
  );
  const [isSigningIn, setIsSigningIn] = useState(false);
  const fontSize = useBreakpointValue({ base: "10px", sm: "12px", md: "16px" });

  const handleSignin = async () => {
    try {
      if (!signIn) return;
      const hexPubKey = publicKey?.toBuffer().toString("hex");
      if (profile?.profile?.public_key === hexPubKey) {
        return;
      }
      const data = await signIn();
      const resp = await authApiClient.login({
        public_key: Buffer.from(data.account.publicKey).toString("hex"),
        signature: Buffer.from(data.signature).toString("hex"),
        message: Buffer.from(data.signedMessage).toString("hex"),
      });
      const profileObject: AuthUtils.ProfileObject = {
        profile: resp.user,
        isAuthenticated: true,
        token: resp.token,
      };

      setUserProfile(profileObject.profile);
      setToken(profileObject.token);
      setAuthenticated(true);

      // set state
      const status = AuthUtils.setProfileInStorage(profileObject);

      if (!status) {
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (
      connected &&
      !isAuthenticated &&
      !isSigningIn &&
      previousKey !== publicKey?.toString()
    ) {
      setIsSigningIn(true);
      handleSignin()
        .then(() => {
          setPreviousKey(publicKey?.toString());
        })
        .finally(() => setIsSigningIn(false));
    }
  }, [connected, publicKey]);

  return (
    <Container className="dual-header">
      <Stack
        direction={["row"]}
        justifyContent={["space-between"]}
        padding="1rem"
        // paddingBottom={"1rem"}
      >
        <HStack>
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/"
            paddingLeft="2rem"
            _hover={{
              textDecoration: "none",
              opacity: 0.6,
            }}
          >
            <Text className="sm:text-md text-[12px]">how does it work?</Text>
          </Link>
        </HStack>
        <HStack>
          <WalletModalProvider>
            <WalletMultiButton
              style={{
                backgroundColor: "#262A2E",
                color: "white",
                fontFamily: "Tsukimi Rounded",
                fontSize,
                justifyContent: "space-around",
                whiteSpace: "nowrap",
                textAlign: "center",
                padding: "0.5rem 1rem",
                maxWidth: "200px",
              }}
            />
          </WalletModalProvider>
        </HStack>
      </Stack>
    </Container>
  );
}

export default Header;
