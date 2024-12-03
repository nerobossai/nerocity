import {
  Box,
  Grid,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { StarSticker } from "../Svgs/Star";
import type { CardProps } from "./index";
import { getTokenHolders } from "@/utils/getTokenHolders";
import { coinApiClient } from "@/modules/Coin/services/coinApiClient";

function timeDifference(current: number, previous: number) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) return `${Math.round(elapsed / 1000)} seconds ago`;
  if (elapsed < msPerHour)
    return `${Math.round(elapsed / msPerMinute)} minutes ago`;
  if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)} hours ago`;
  return `${Math.round(elapsed / msPerDay)} days ago`;
}

function CreatedAtComponent({
  timeStamp,
  noHeader = false,
  fontSize = "14px",
  alignItems = "flex-end",
}: {
  timeStamp: number;
  noHeader?: boolean;
  fontSize?: string;
  alignItems?: string;
}) {
  const date = new Date(timeStamp);
  const isSmallScreen = useBreakpointValue({ base: false, sm: true });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <VStack alignItems={alignItems} gap="1px">
      {!noHeader && (
        <Text fontSize="12px" color="text.100">
          CREATED
        </Text>
      )}
      <Text fontSize={fontSize} textAlign={isSmallScreen ? "right" : "left"}>{timeDifference(Date.now(), timeStamp)}</Text>
      <Text fontSize="12px" color="text.100">
        {formattedTime}
      </Text>
      <Text fontSize="12px" color="text.100">
        {formattedDate}
      </Text>
    </VStack>
  );
}



function MainCard(props: CardProps) {
  const navigator = useRouter();
  const isMediumScreen = useBreakpointValue({ base: false, md: true });
  const [tokenHolders, setTokenHolders] = useState<string>("0");


  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const resp = await coinApiClient.getAgent(props.id);
        if (!resp?.id) {
          return;
        }
        const data = await getTokenHolders(resp.mint_public_key);
        setTokenHolders(data);
      } catch (e) {
        console.error(e)
      }
    }
    fetchHolders()
  }, [])

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    } else {
      navigator.push(props.id);
    }
  };
  return (
    <Stack
      padding="20px"
      width="100%"
      marginTop="20px"
      border="1px solid #6F5034"
      bg="brown.300"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      justifyContent="center"
      _hover={{ opacity: 0.8 }}
      onClick={handleClick}
      position="relative"
      overflow="hidden"
      cursor="pointer"
    >
      <HStack
        className="card-main"
        justifyContent="start"
        alignItems="start"
        spacing="1rem"
        gap="1rem"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Image
          boxSize="6rem"
          objectFit="cover"
          src={props.image}
          alt="ai agent image"
        />
        <VStack textAlign="left" alignItems="start" maxWidth={{ lg: "250px", base: "auto" }}>
          <Heading as="h4" size="md" fontSize="16px">
            ${props.ticker}
          </Heading>
          <Heading as="h5" size="sm" textAlign="left">
            {props.name}
          </Heading>
          <Text fontSize="12px" fontWeight="bold" color="text.100">
            {props.description?.slice(0, 100)}...<span className="underline">READ MORE</span>
          </Text>
        </VStack>
      </HStack>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(6, 1fr)",
        }}
        textTransform="uppercase"
        gap="2rem"
      >
        <CreatedAtComponent
          timeStamp={parseInt(props.created_at.toString())}
          alignItems={isMediumScreen ? "flex-end" : "flex-start"}
        />
        <VStack alignItems={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="12px" color="text.100">
            CREATOR
          </Text>
          <Text fontSize="14px" color="#00C2FF">
            {props.created_by}
          </Text>
        </VStack>
        <VStack alignItems={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="12px" color="text.100">
            MCAP
          </Text>
          <Text fontSize="14px">${props.market_cap}</Text>
        </VStack>
        <VStack alignItems={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="12px" color="text.100">
            HOLDERS
          </Text>
          <Text fontSize="14px">{tokenHolders ?? "0"}</Text>
        </VStack>
        <VStack alignItems={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="12px" color="text.100">
            COMMENTS
          </Text>
          <Text fontSize="14px">{props.replies}</Text>
        </VStack>
        <VStack alignItems={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="12px" color="text.100">
            24H
          </Text>
          <Text fontSize="14px">{props.twenty_four_hr_changes ?? "--"}</Text>
        </VStack>
        <Box position="absolute" bottom="0" right="0">
          <StarSticker />
        </Box>
      </Grid>
    </Stack>
  );
}

export default MainCard;
