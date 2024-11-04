import { Input } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 2rem;
`;

function SearchModule() {
  return (
    <Container>
      <Input
        textAlign="center"
        variant="filled"
        width="50vw"
        _placeholder={{
          color: "black",
          fontWeight: "bold",
        }}
        _focus={{
          backgroundColor: "grey.700",
          color: "black",
          fontWeight: "bold",
          borderColor: "grey.100",
        }}
        placeholder="Search for an ai agent coin"
      />
    </Container>
  );
}

export default SearchModule;
