import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

export type TradeModuleProps = {
  currentPrice: string;
  holders: number | string;
};

function TradeModule(props: TradeModuleProps) {
  const [active, setActive] = useState("buy");

  return (
    <Stack marginTop="1rem">
      <HStack
        spacing="3rem"
        padding="1rem"
        backgroundColor="grey.50"
        borderRadius="0.5rem"
        justifyContent="space-evenly"
      >
        <VStack
          color="green.50"
          textAlign="center"
          fontWeight="bold"
          fontSize="12px"
        >
          <Text>Price</Text>
          <Text>${props.currentPrice}</Text>
        </VStack>
        <VStack textAlign="center" fontWeight="bold" fontSize="12px">
          <Text>Holders</Text>
          <Text>{props.holders}</Text>
        </VStack>
      </HStack>
      <Stack
        spacing="0.5rem"
        padding="1rem"
        backgroundColor="grey.50"
        borderRadius="0.5rem"
      >
        <HStack justifyContent="center">
          <Button
            backgroundColor={active === "buy" ? "green.100" : "black"}
            color={active === "buy" ? "white" : "grey"}
            width="30vw"
            variant="ghosted"
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => setActive("buy")}
          >
            Buy
          </Button>
          <Button
            backgroundColor={active === "sell" ? "red.50" : "black"}
            color={active === "sell" ? "white" : "grey"}
            _hover={{
              opacity: 0.8,
            }}
            variant="ghosted"
            width="30vw"
            onClick={() => setActive("sell")}
          >
            Sell
          </Button>
        </HStack>
        <InputGroup>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
          />
          <InputRightAddon backgroundColor="grey.100" border={0}>
            SOL
          </InputRightAddon>
        </InputGroup>
        <HStack justifyContent="space-between">
          <Text fontSize="10px" fontWeight="bold">
            $2.97
          </Text>
          <Text fontSize="10px" fontWeight="bold">
            1 SOL = $126
          </Text>
        </HStack>
        <InputGroup>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
          />
          <InputRightAddon backgroundColor="grey.100" border={0}>
            $TYBF
          </InputRightAddon>
        </InputGroup>
        <Text textAlign="end" fontSize="10px" fontWeight="bold">
          1 TYBF = $0.000023
        </Text>
        <Button>Place Trade</Button>
      </Stack>
    </Stack>
  );
}

export default TradeModule;
