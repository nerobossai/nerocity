import {
  Box,
  HStack,
  Link,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import type { CardProps } from "@/components/Card";
import SubscriptText from "@/components/SubscriptText";
import { getSolScanLink } from "@/utils";
import { timeDifference } from "@/utils/timeDifference";
import { truncateString } from "@/utils/truncateString";

import ProgressModule from "./progress";

function CoinHeaderModule(props: CardProps) {
  const isLargeScreen = useBreakpointValue({ base: false, md: true });

  if (!isLargeScreen) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        w="full"
        mr="auto"
        flexGrow={1}
        px={8}
        gap={8}
      >
        <HStack spacing="0.5rem" alignItems="flex-start">
          <Text fontSize="24px" fontWeight="bold">
            {props.name}
          </Text>
          <Text fontSize="24px" fontWeight="bold">
            {`$${props.ticker}`}
          </Text>
        </HStack>

        <HStack spacing="5rem" borderRadius="0.5rem" alignItems="flex-start">
          <VStack
            textAlign="left"
            fontSize="12px"
            alignItems="flex-start"
            flex="1"
          >
            <Text fontWeight="bold" color="green.50">
              Market Cap
            </Text>
            <Text>
              <SubscriptText value={props.market_cap} />
            </Text>
          </VStack>

          <VStack
            textAlign="left"
            fontSize="12px"
            alignItems="flex-start"
            flex="1"
          >
            <Text>Coin Address</Text>
            <Link href={getSolScanLink(props.id)} target="_blank">
              <Text>{truncateString(props.id)}</Text>
            </Link>
          </VStack>
        </HStack>

        <HStack spacing="5rem" borderRadius="0.5rem" alignItems="flex-start">
          <VStack
            textAlign="left"
            fontSize="12px"
            alignItems="flex-start"
            flex="1"
          >
            <Text>Created By</Text>
            <Text>@{props.created_by}</Text>
          </VStack>

          <VStack
            textAlign="left"
            fontSize="12px"
            alignItems="flex-start"
            flex="1"
          >
            <Text fontWeight="bold" color="blue.50">
              Created
            </Text>
            <Text>
              {timeDifference(
                Date.now(),
                parseInt(props.created_at.toString(), 10),
              )}
            </Text>
          </VStack>
        </HStack>

        <VStack width="100%" alignItems="flex-start" flexGrow={1}>
          <ProgressModule completionPercent={props.completionPercent ?? 0} />
        </VStack>
      </Box>
    );
  }

  return (
    <HStack marginTop="1rem" justifyContent="space-between">
      <Text fontSize="24px" fontWeight="bold">
        {props.name} {`$${props.ticker}`}
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
          <Text>
            <SubscriptText value={props.market_cap} />
          </Text>
        </VStack>
        <VStack textAlign="center" fontSize="12px">
          <Text>Coin Address</Text>
          <Link href={getSolScanLink(props.id)} target="_blank">
            <Text>{truncateString(props.id)}</Text>
          </Link>
        </VStack>
        <VStack textAlign="center" fontSize="12px">
          <Text>Created By</Text>
          <Text>@{props.created_by}</Text>
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
