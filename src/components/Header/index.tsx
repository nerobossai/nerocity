"use client";

import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { FaWallet } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import styled from "styled-components";

import { coinApiClient } from "@/modules/Coin/services/coinApiClient";
import { trackWalletConnect } from "@/modules/Home/services/analytics";
import { authApiClient } from "@/modules/Home/services/authApiClient";
import { useSearchStore } from "@/stores/useSearchStore";
import useUserStore from "@/stores/useUserStore";
import * as AuthUtils from "@/utils/AuthUtils";

import { Logo } from "../Svgs/Logo";
import { LogoSmall } from "../Svgs/LogoSmall";
import SearchResults from "./SearchResults";

function formatToShortLink(number: any) {
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`;
  }

  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  }

  return number?.toString();
}

const Container = styled.header`
  /* max-width: 490px; */
  background-color: #0b0d0e;
`;

function Header() {
  const router = useRouter();
  const toast = useToast();
  const {
    searchText,
    setSearchText,
    displaySearchResults,
    setDisplaySearchResults,
  } = useSearchStore();
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
    signMessage,
  } = useWallet();

  const [previousKey, setPreviousKey] = useState<string | undefined>(
    publicKey?.toString(),
  );
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const fontSize = useBreakpointValue({ base: "10px", sm: "12px", md: "16px" });
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });
  const vStackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [marketCap, setMarketCap] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  const walletAddress = useMemo(() => {
    if (profile && profile.profile && profile.profile.address) {
      return `${profile.profile.address.slice(
        0,
        3,
      )}...${profile.profile.address.slice(-3)}`;
    }

    return "tst...val";
  }, [profile]);

  const handleSignin = async () => {
    try {
      if (!signMessage || !publicKey) {
        console.error(
          "Wallet not connected or does not support message signing",
        );
        return;
      }

      const message = "Sign this message to authenticate";
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await signMessage(encodedMessage);

      const hexPubKey = publicKey.toBuffer().toString("hex");
      if (profile?.profile?.public_key === hexPubKey) {
        return;
      }

      const resp = await authApiClient.login({
        public_key: hexPubKey,
        signature: Buffer.from(signedMessage).toString("hex"),
        message: Buffer.from(encodedMessage).toString("hex"),
      });

      const profileObject: AuthUtils.ProfileObject = {
        profile: resp.user,
        isAuthenticated: true,
        token: resp.token,
      };

      setUserProfile(profileObject);
      setToken(profileObject.token);
      setAuthenticated(true);
      setIsOpen(false);

      const status = AuthUtils.setProfileInStorage(profileObject);
      trackWalletConnect({
        wallet_address: publicKey.toString(),
      });

      if (!status) {
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      handleDisconnect();
      toast({
        title: "Error",
        description: "Unable to connect!",
        status: "error",
        position: "bottom-right",
      });
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        vStackRef.current &&
        !vStackRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideInput = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setDisplaySearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideInput);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInput);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && !isAuthenticated && !isSigningIn) {
      setIsSigningIn(true);
      handleSignin()
        .then(() => {
          setPreviousKey(publicKey?.toString());
        })
        .finally(() => setIsSigningIn(false));
    }
  }, [connected, publicKey]);

  useEffect(() => {
    const fetchMarketCap = async () => {
      // Market Cap for Neroboss
      const data = await coinApiClient.fetchPumpfunData(
        "5HTp1ebDeBcuRaP4J6cG3r4AffbP4dtcrsS7YYT7pump",
      );
      setMarketCap(formatToShortLink(data.usd_market_cap));
    };
    fetchMarketCap();
  }, []);

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
  if (!mounted) {
    return (
      <HStack
        bg="brown.100"
        height="70px"
        py="1rem"
        align="center"
        gap={{ base: "5px", sm: "40px" }}
        px="1rem"
        width="100vw"
        justifyContent={{ base: "space-between", md: "block" }}
      />
    );
  }
  if (inputFocus) {
    return (
      <HStack
        bg="brown.100"
        height="70px"
        py="1rem"
        align="center"
        gap={{ base: "5px", sm: "40px" }}
        px="1rem"
        justifyContent={{ base: "space-between", md: "block" }}
      >
        <Box cursor="pointer" marginLeft="24px">
          <Link href="/app">{isLargeScreen ? <Logo /> : <LogoSmall />}</Link>
        </Box>
        <Box
          display="flex"
          bg="brown.200"
          alignItems="center"
          gap="20px"
          px="1rem"
          position="relative"
          ref={inputRef}
        >
          <BiSearch size={20} />
          <Input
            outline="none"
            border="0"
            flexGrow="1"
            padding="0"
            placeholder="Search for agents"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onBlur={() => {
              setTimeout(() => setInputFocus(false), 500);
            }}
            onFocus={() => setDisplaySearchResults(true)}
            _focus={{
              outline: "none",
              border: "none",
              boxShadow: "none",
            }}
            autoFocus
          />
          <SearchResults
            searchText={searchText}
            setSearchText={setSearchText}
            displaySearchResults={displaySearchResults}
          />
        </Box>
      </HStack>
    );
  }
  return (
    <HStack
      bg="brown.100"
      height="70px"
      pl="40px"
      py="1rem"
      align="center"
      gap={{ base: "5px", md: "40px" }}
      justifyContent={{ base: "space-between", md: "block" }}
    >
      <Link href="/app">
        <Box cursor="pointer">{isLargeScreen ? <Logo /> : <LogoSmall />}</Box>
      </Link>
      {isSmallScreen ? (
        <Box ml="20px">
          <BiSearch
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setInputFocus(true)}
          />{" "}
        </Box>
      ) : (
        <Box padding="20px">
          <Box
            px="2rem"
            display="flex"
            bg="brown.200"
            alignItems="center"
            gap="20px"
            position="relative"
            ref={inputRef}
          >
            <BiSearch size={20} />
            <Input
              outline="none"
              border="0"
              flexGrow="1"
              padding="0"
              placeholder="Search for agents"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              _focus={{
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
              onFocus={() => setDisplaySearchResults(true)}
            />
            <SearchResults
              searchText={searchText}
              setSearchText={setSearchText}
              displaySearchResults={displaySearchResults}
            />
          </Box>
        </Box>
      )}
      <HStack display={{ base: "none", md: "flex" }}>
        <a
          href="https://raydium.io/swap/?inputMint=sol&outputMint=5HTp1ebDeBcuRaP4J6cG3r4AffbP4dtcrsS7YYT7pump"
          target="_blank"
        >
          <Button color="#571F0D" bg="white" padding="0px 12px">
            BUY $NEROBOSS
          </Button>
        </a>
        <Text display={{ base: "none", md: "flex" }}> MCAP ${marketCap}</Text>
      </HStack>
      <HStack flexGrow="1" justifyContent="flex-end" position="relative">
        {isAuthenticated ? (
          <>
            <Button
              onClick={() => setIsOpen(true)}
              bg="#1FEF34"
              color="primary"
              display="flex"
              gap="10px"
              alignItems="center"
              _hover={{ opacity: 0.8 }}
              fontSize="14px"
              fontWeight={300}
              borderRadius="0"
              marginRight="15px"
            >
              <FaWallet />
              <span>{walletAddress}</span>
            </Button>
            <VStack
              ref={vStackRef}
              zIndex="100"
              position="absolute"
              gap="20px"
              display={isOpen ? "block" : "none"}
              alignItems="flex-start"
              fontSize="12px"
              right="10"
              border="0.5px solid grey"
              transform="translateY(70px)"
              bg="#1a1a1c"
              color="white"
              padding="1rem"
            >
              <HStack
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/profile/${profile.profile?.username}`);
                }}
                cursor="pointer"
                justifyContent="flex-start"
              >
                <Text color="text.100">{walletAddress}</Text>
                <MdArrowOutward color="#737373" />
              </HStack>

              <HStack
                cursor="pointer"
                gap="50px"
                marginTop="10px"
                onClick={() => {
                  setIsOpen(false);
                  handleDisconnect();
                }}
              >
                <Text>DISCONNECT</Text>
                <CiLogout color="white" />
              </HStack>
            </VStack>
            {/* <ProfileModalComponent
              userDetails={profile.profile ?? profile}
              isOpen={isOpen && isAuthenticated}
              onClose={() => setIsOpen(false)}
              disconnect={handleDisconnect}
              isDisconnecting={isDisconnecting}
            />{" "} */}
          </>
        ) : (
          <WalletModalProvider>
            <WalletMultiButton style={{ backgroundColor: "transparent" }}>
              <Box
                bg="#1FEF34"
                width="120px"
                borderRadius="0"
                height="40px"
                color="white"
                padding="15px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                _hover={{
                  boxShadow: "0px 2px 3px 0px #21972D1A",
                }}
                _focus={{
                  boxShadow: "0px 6px 6px 0px #21972D17",
                }}
                _active={{
                  boxShadow: "0px 14px 9px 0px #21972D0D",
                }}
                _disabled={{
                  boxShadow: "0px 25px 10px 0px #21972D03",
                }}
                gap="10px"
              >
                <FaWallet />
                <span>Connect</span>
              </Box>
            </WalletMultiButton>
          </WalletModalProvider>
        )}
      </HStack>
    </HStack>
  );
}

export default Header;
