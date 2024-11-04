import { Center, Text } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

const Container = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
`;

function Footer() {
  return (
    <Container>
      <Center width="100%">
        <Text color="primary.600" fontFamily="sfpt">
          Copyright &#169; 2024 Martian. All rights reserved.
        </Text>
      </Center>
    </Container>
  );
}

export default Footer;
