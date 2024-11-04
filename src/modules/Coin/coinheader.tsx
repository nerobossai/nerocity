import { HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { timeDifference } from "@/utils/timeDifference";

type CoinHeaderProps = {
  image: string;
  createdBy: string;
  marketCap: string;
  replies: string;
  name: string;
  ticker: string;
  createdAt: number | string;
  coinAddress: string;
  description?: string;
};

function CoinHeaderModule(props: CoinHeaderProps) {
  return (
    <HStack marginTop="1rem" justifyContent="space-between">
      <Text fontSize="24px" fontWeight="bold">
        {props.name} {props.ticker}
      </Text>
      <HStack
        spacing="5rem"
        padding="1rem"
        backgroundColor="grey.50"
        borderRadius="0.5rem"
      >
        <VStack
          color="green.50"
          textAlign="center"
          fontWeight="bold"
          fontSize="12px"
        >
          <Text>Market Cap</Text>
          <Text>{props.marketCap}</Text>
        </VStack>
        <VStack textAlign="center" fontSize="12px">
          <Text>Coin Address</Text>
          <Text>{props.coinAddress}</Text>
        </VStack>
        <VStack textAlign="center" fontSize="12px">
          <Text>Created By</Text>
          <Text>{props.createdBy}</Text>
        </VStack>
        <VStack
          textAlign="center"
          color="blue.50"
          fontWeight="bold"
          fontSize="12px"
        >
          <Text>Created</Text>
          <Text>
            {" "}
            {timeDifference(
              Date.now(),
              parseInt(props.createdAt.toString(), 10),
            )}
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
}

export default CoinHeaderModule;
