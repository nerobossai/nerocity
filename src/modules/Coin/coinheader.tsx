import { HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

import type { CardProps } from "@/components/Card";
import { timeDifference } from "@/utils/timeDifference";

function CoinHeaderModule(props: CardProps) {
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
          <Text>{props.market_cap}</Text>
        </VStack>
        <VStack textAlign="center" fontSize="12px">
          <Text>Coin Address</Text>
          <Text>{props.id}</Text>
        </VStack>
        <VStack textAlign="center" fontSize="12px">
          <Text>Created By</Text>
          <Text>{props.created_by}</Text>
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
              parseInt(props.created_at.toString(), 10),
            )}
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
}

export default CoinHeaderModule;
