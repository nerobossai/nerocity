import { Link, Text } from "@chakra-ui/react";
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
        Copyright &#169; All rights by Kegen Labs, Inc.
      </Text>
      <Text color="primary.600" fontSize="12px">
        This site is protected by reCAPTCHA and the Google{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> and&nbsp;
        <Link href="/terms-of-service">Terms of Service</Link> apply
      </Text>
    </Container>
  );
}

export default Footer;
