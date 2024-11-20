"use client";

import {
  Avatar,
  Box,
  Button,
  HStack,
  Input,
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

import { trackWalletConnect } from "@/modules/Home/services/analytics";
import { authApiClient } from "@/modules/Home/services/authApiClient";
import useUserStore from "@/stores/useUserStore";
import * as AuthUtils from "@/utils/AuthUtils";

import HelpComponent from "../Help";
import ProfileModalComponent from "../ProfileModal";
import { Logo } from "../Svgs/Logo";
import { FaWallet } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const fontSize = useBreakpointValue({ base: "10px", sm: "12px", md: "16px" });
  const isLargeScreen = useBreakpointValue({ base: false, md: true });

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
      setIsOpen(false);

      // set state
      const status = AuthUtils.setProfileInStorage(profileObject);
      trackWalletConnect({
        wallet_address:
          publicKey?.toString() || data.account.publicKey.toString(),
      });

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
      !isSigningIn
    ) {
      setIsSigningIn(true);
      handleSignin()
        .then(() => {
          setPreviousKey(publicKey?.toString());
        })
        .finally(() => setIsSigningIn(false));
    }
  }, [connected, publicKey]);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      reset();
      await disconnect();
      AuthUtils.signOut();
      setIsSigningIn(false);
      setIsDisconnecting(false);
    } catch (err) {
      console.error("Error disconnecting wallet", err);
      setIsDisconnecting(false);
    }
  };

  return (
    <HStack bg="indigo.100" height="70px" pl="40px" py="1rem" align="center" gap="40px" justifyContent={{base:"space-between", md:"block"}}>
      <Link href="/">
        <Logo />
      </Link>
      <Box flexGrow="1" padding="20px" display={{base:"none", md:"block"}}>
        <Box
          px="2rem"
          display="flex"
          bg="indigo.200"
          width="60%"
          alignItems="center"
          gap="20px"
        >
          <BiSearch size={20} />
          <Input
            outline="none"
            border="0"
            flexGrow="1"
            padding="0"
            placeholder="Search for agent / coin"
            _focus={{
              outline: "none",
              border: "none",
              boxShadow: "none",
            }}
          />
        </Box>

      </Box>
      <HStack>
        {isAuthenticated ? (
          <>
            <Button
              onClick={() => setIsOpen(true)}
              backgroundColor="grey.100"
              color="primary"
              display="flex"
              gap="10px"
              alignItems="center"
              _hover={{ opacity: 0.8 }}
              fontSize="14px"
              fontWeight={300}
            >
              <Avatar
                boxSize="20px"
                src={profile?.profile_pic ?? profile?.profile?.profile_pic}
              />
              <Text>{profile?.username ?? profile?.profile?.username}</Text>
            </Button>
            <ProfileModalComponent
              userDetails={profile.profile ?? profile}
              isOpen={isOpen && isAuthenticated}
              onClose={() => setIsOpen(false)}
              disconnect={handleDisconnect}
              isDisconnecting={isDisconnecting}
            />{" "}
          </>
        ) : (
          <WalletModalProvider>
            <WalletMultiButton style={{backgroundColor:"transparent"}}>
              <Button bg="#1FEF34" width="140px" borderRadius="0"  color="white" padding="15px" display="flex" justifyContent="space-between"
                _hover={{
                  boxShadow: "0px 2px 3px 0px #21972D1A"
                }}
                _focus={{
                  boxShadow: "0px 6px 6px 0px #21972D17"
                }}
                _active={{
                  boxShadow: "0px 14px 9px 0px #21972D0D"
                }}
                _disabled={{
                  boxShadow: "0px 25px 10px 0px #21972D03"
                }}
              
              gap="10px">
                <FaWallet />
                <span>Connect</span>
              </Button>
            </WalletMultiButton>
          </WalletModalProvider>
        )}
      </HStack>
    </HStack>
  );
}

export default Header;
