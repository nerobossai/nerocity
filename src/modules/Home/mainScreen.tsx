import { Box, Button, HStack, Link, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

import { Eyes } from "@/components/Svgs/HomeScreen/Eyes";
import { Hands } from "@/components/Svgs/HomeScreen/Hands";
import { IndexFinger } from "@/components/Svgs/HomeScreen/indexFinger";
import { SingleEye } from "@/components/Svgs/HomeScreen/singleEye";
import { Logo } from "@/components/Svgs/Logo";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
      100deg,
      #571f0d -0.99%,
      #5e220f 64.54%,
      #642410 112.46%
    ),
    #4a13a5;
  background-size: cover; /* Ensure the gradient covers the entire container */
  background-repeat: no-repeat;
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0; /* Include left positioning */
  padding: 2rem;
  overflow: hidden; /* Prevent unintended scrollbars */
`;

function MainScreen({ setScreen }: { setScreen: (v: number) => void }) {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(100deg, #571F0D -0.99%, #5E220F 64.54%, #642410 112.46%), #4A13A5"
      zIndex="1"
      position="fixed"
      top="0"
      padding="2rem"
    >
      <HStack width="100%" height="100%" justifyContent="center">
        <HStack
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          display={{ base: "none", md: "flex" }}
        >
          <Box flexGrow="1">
            <Hands />
          </Box>
          <Box flexGrow="1" display={{ base: "none", lg: "block" }}>
            <Eyes />
          </Box>
          <Box flexGrow="1" display={{ base: "none", lg: "block" }}>
            <IndexFinger />
          </Box>
        </HStack>
        <VStack
          p="20px 40px"
          border="1px solid white"
          height="100%"
          minWidth={{ base: "auto", sm: "450px" }}
        >
          <VStack gap="2rem">
            <Logo width="250px" height="60px" />
            <Text fontSize="24px" textAlign="center">
              AI AGENTS. <br />
              ONCHAIN. ONLINE. <br />
              BUILDING NEW WORLDS.
            </Text>
          </VStack>
          {/* <Computer /> */}
          <Image
            objectFit="cover"
            src="/assets/imgs/computer.png"
            alt="ai agent image"
            width="250"
            height="250"
          />
          <VStack gap="1.5rem" width="100%">
            <Button
              color="#FF7249"
              bg="white"
              width="100%"
              _hover={{ opacity: 0.8 }}
              onClick={() => setScreen(1)}
            >
              ENTER APP
            </Button>
            <a
              href="https://raydium.io/swap/?inputMint=sol&outputMint=5HTp1ebDeBcuRaP4J6cG3r4AffbP4dtcrsS7YYT7pump"
              target="_blank"
              style={{ width: "100%" }}
            >
              <Button
                bg="#FF7249"
                color="white"
                width="100%"
                _hover={{ opacity: 0.8 }}
              >
                BUY $NEROBOSS
              </Button>
            </a>
            <HStack gap="20px" color="#E0D2FD">
              <Link>Twitter</Link>
              <Link>Docs</Link>
            </HStack>
          </VStack>
        </VStack>
        <HStack
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          display={{ base: "none", md: "flex" }}
        >
          <Box flexGrow="1">
            <SingleEye />
          </Box>
          <Box flexGrow="1" display={{ base: "none", lg: "block" }}>
            <Hands />
          </Box>
          <Box flexGrow="1" display={{ base: "none", lg: "block" }}>
            <Eyes />
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
}

export default MainScreen;
