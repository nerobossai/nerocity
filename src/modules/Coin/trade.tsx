import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import type {
  AgentResponse,
  SolanaPriceResponse,
} from "../Home/services/homeApiClient";
import { homeApiClient } from "../Home/services/homeApiClient";

export type TradeModuleProps = {
  currentPrice: string;
  holders: number | string;
  tokenDetails: AgentResponse;
};

function TradeModule(props: TradeModuleProps) {
  const [active, setActive] = useState("buy");
  const [solPrice, setSolPrice] = useState<SolanaPriceResponse>();
  const [loading, setLoading] = useState(false);

  const fetchPrice = async () => {
    try {
      setLoading(true);
      const resp = await homeApiClient.solPrice();
      setSolPrice(resp);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, []);

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
            {active === "buy" ? "SOL" : `${props.tokenDetails.ticker}`}
          </InputRightAddon>
        </InputGroup>
        <HStack justifyContent="space-between">
          <Text fontSize="10px" fontWeight="bold">
            $2.97
          </Text>
          <Text fontSize="10px" fontWeight="bold">
            1 {active === "buy" ? "SOL" : `${props.tokenDetails.ticker}`} ={" "}
            {loading ? (
              <Spinner />
            ) : active === "buy" ? (
              `$${solPrice?.solana.usd}` || "$164.84"
            ) : (
              `$${props.currentPrice}`
            )}
          </Text>
        </HStack>
        <InputGroup>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
          />
          <InputRightAddon backgroundColor="grey.100" border={0}>
            {active === "sell" ? "SOL" : `${props.tokenDetails.ticker}`}
          </InputRightAddon>
        </InputGroup>
        <Text textAlign="end" fontSize="10px" fontWeight="bold">
          1 {active === "sell" ? "SOL" : `${props.tokenDetails.ticker}`} = $
          {active === "sell"
            ? `${solPrice?.solana.usd}` || "$164.84"
            : props.currentPrice}
        </Text>
        <Button>Place Trade</Button>
      </Stack>
    </Stack>
  );
}

export default TradeModule;
