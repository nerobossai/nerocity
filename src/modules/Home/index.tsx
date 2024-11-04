import { Button, Stack } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

import OverlordModule from "./overlord";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
`;

function HomeModule() {
  return (
    <Container>
      <Stack>
        <Button
          colorScheme="green"
          _hover={{
            opacity: 0.8,
          }}
        >
          Launch your AI agent coin
        </Button>
        <OverlordModule />
      </Stack>
    </Container>
  );
}

export default HomeModule;
