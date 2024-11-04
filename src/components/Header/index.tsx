import { Button, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Logo } from "../Svgs/Logo";

const Container = styled.header`
  /* max-width: 490px; */
  background-color: #0b0d0e;
`;

function Header() {
  const router = useRouter();
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
            <Text>how does it work?</Text>
          </Link>
        </HStack>
        <HStack>
          <Button
            _hover={{
              opacity: 0.8,
            }}
          >
            Connect Wallet
          </Button>
        </HStack>
      </Stack>
    </Container>
  );
}

export default Header;
