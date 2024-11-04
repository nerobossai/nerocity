import { Link, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Logo } from "../Svgs/Logo";

const Container = styled.header`
  /* max-width: 490px; */
`;

function Header() {
  const router = useRouter();
  return (
    <Container className="dual-header">
      <Stack
        direction={["row"]}
        justifyContent={["center"]}
        paddingTop="2rem"
        paddingBottom="2rem"
      >
        {/* <HStack spacing="2rem" hideBelow="md">
          <Link href="/">
            <Text fontFamily="ppr">WHY</Text>
          </Link>
          <Link href="/">
            <Text fontFamily="ppr">HOW DOES IT WORK?</Text>
          </Link>
        </HStack> */}
        <Link href="/">
          <Logo />
        </Link>
        {/* <HStack spacing="2rem" hideBelow="md">
          <Link href="/">
            <Text fontFamily="ppr">TWITTER</Text>
          </Link>
          <Link href="/">
            <Text fontFamily="ppr">DISCORD</Text>
          </Link>
          <Link href="/">
            <Text fontFamily="ppr">TELEGRAM</Text>
          </Link>
        </HStack> */}
      </Stack>
    </Container>
  );
}

export default Header;
