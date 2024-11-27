import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { RiTwitterXFill } from "react-icons/ri";

import SubscriptText from "@/components/SubscriptText";
import { BoughtTrade } from "@/components/Svgs/BoughtTrade";

import type { AgentResponse } from "../Home/services/homeApiClient";

interface ISuccessDetails {
  bought: boolean;
  tickerAmount: number;
  solAmount: number;
}

function TradeSuccess({
  tokenDetails,
  successDetails,
}: {
  tokenDetails: AgentResponse;
  successDetails: ISuccessDetails;
}) {
  return (
    <Stack
      spacing="0.5rem"
      padding="1rem"
      backgroundColor="#021F05"
      gap="1rem"
      borderRadius="0.5rem"
      justifyContent="space-between"
      position="relative"
    >
      <Box position="absolute" right="0" top="0">
        <BoughtTrade />
      </Box>
      <Text fontSize="48px">{successDetails.bought ? "BOUGHT!" : "SOLD"}</Text>
      <VStack alignItems="left">
        <Text fontSize="24px">{successDetails.tickerAmount}</Text>
        <HStack>
          <Image
            boxSize="2rem"
            objectFit="cover"
            src={tokenDetails.image}
            alt="ai agent image"
          />
          <Text>{tokenDetails.name}</Text>
        </HStack>
      </VStack>
      <HStack mt="5px">
        <Button
          padding="12px 16px"
          bg="white"
          color="black"
          borderRadius="0"
          display="flex"
          gap="10px"
          alignItems="center"
        >
          <Text>SHARE</Text>
          <RiTwitterXFill />
        </Button>
      </HStack>

      <VStack
        mt="80px"
        borderTop="1px solid #29292E"
        paddingTop="15px"
        color="#9B9B9B"
        fontSize="10px"
        textTransform="uppercase"
      >
        <HStack width="100%" justifyContent="space-between">
          <Text>Sol {successDetails.bought ? "paid" : "received"}</Text>
          <Text>
            <SubscriptText value={successDetails.solAmount.toString()} />
          </Text>
        </HStack>
        <HStack width="100%" justifyContent="space-between">
          <Text>SLIPPAGE</Text> <Text>1%</Text>
        </HStack>
        <HStack width="100%" justifyContent="space-between">
          <Text>PRICE IMPACT</Text> <Text>12%</Text>
        </HStack>
        <HStack width="100%" justifyContent="space-between">
          <Text>Txn</Text>{" "}
          <Text
            color="creator"
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap="4px"
          >
            01213134 <GoArrowUpRight />
          </Text>
        </HStack>
      </VStack>
    </Stack>
  );
}

export default TradeSuccess;
