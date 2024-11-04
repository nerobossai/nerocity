import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React from "react";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 2rem;
`;

function SearchModule() {
  return (
    <Container>
      <InputGroup>
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
        <InputRightElement>
          <FaSearch color="black" size="20px" opacity={0.7} />
        </InputRightElement>
      </InputGroup>
    </Container>
  );
}

export default SearchModule;
