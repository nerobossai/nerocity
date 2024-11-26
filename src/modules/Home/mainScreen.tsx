import { Button, HStack, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

import { Computer } from "@/components/Svgs/HomeScreen/Computer";
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
  z-index: 1;
  position: fixed;
  top: 0;
  padding: 2rem;
`;

function MainScreen({ setScreen }: { setScreen: (v: number) => void }) {
  return (
    <Container>
      <HStack width="100%" height="100%" justifyContent="center">
        {/* <HStack width="100%" height="100%" alignItems="center" justifyContent="center" display={{base:"none", md:"flex"}}>
          <Box flexGrow="1">
            <Hands />
          </Box>
          <Box flexGrow="1" display={{base:"none", lg:"block"}}>
            <Eyes />
          </Box>
          <Box flexGrow="1" display={{base:"none", lg:"block"}}>
            <IndexFinger />
          </Box>
          
        </HStack> */}
        <VStack
          p="40px"
          border="1px solid white"
          height="100%"
          bg="linear-gradient(100deg, #571F0D -0.99%, #5E220F 64.54%, #642410 112.46%), #4A13A5"
        >
          <VStack gap="2rem">
            <Logo width="250px" height="60px" />
            <Text fontSize="32px" textAlign="center">
              AI AGENTS. <br />
              ONCHAIN. ONLINE. <br />
              BUILDING NEW WORLDS.
            </Text>
          </VStack>
          <Computer />
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
            <Button
              bg="#FF7249"
              color="white"
              width="100%"
              _hover={{ opacity: 0.8 }}
            >
              BUY $NEROBOSS
            </Button>
            <HStack gap="20px" color="#E0D2FD">
              <Link>Twitter</Link>
              <Link>Docs</Link>
            </HStack>
          </VStack>
        </VStack>
        {/* <HStack width="100%" height="100%" alignItems="center" justifyContent="center" display={{base:"none", md:"flex"}}>
          <Box flexGrow="1">
            <SingleEye />
          </Box>
          <Box flexGrow="1" display={{base:"none", lg:"block"}}>
            <Hands />
          </Box>
          <Box flexGrow="1" display={{base:"none", lg:"block"}}>
            <Eyes />
          </Box>
          
        </HStack> */}
      </HStack>
    </Container>
  );
}

export default MainScreen;
