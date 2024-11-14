import { Text } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

const Container = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  bottom: 0;
`;

function Footer() {
  return (
    <Container>
      <Text color="primary.600" fontSize="12px">
        Copyright &#169; 2024 Martian. All rights reserved.
      </Text>
      <Text color="primary.600" fontSize="12px">
        This site is protected by reCAPTCHA and the Google Privacy Policy and
        Terms of Service apply
      </Text>
    </Container>
  );
}

export default Footer;
