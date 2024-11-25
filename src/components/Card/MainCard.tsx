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
import React from "react";

import CreatedAtComponent from "../Created";
import { StarSticker } from "../Svgs/Star";
import type { CardProps } from "./index";

function MainCard(props: CardProps) {
  const navigator = useRouter();
  const isMediumScreen = useBreakpointValue({ base: false, md: true });

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
        <VStack textAlign="left" alignItems="start">
          <Heading as="h4" size="md" fontSize="16px">
            {props.ticker}
          </Heading>
          <Heading as="h5" size="sm" textAlign="left">
            {props.name}
          </Heading>
          <Text fontSize="12px" fontWeight="bold" color="text.100">
            {props.description}
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
          <Text fontSize="14px">{props.market_cap}</Text>
        </VStack>
        <VStack alignItems={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="12px" color="text.100">
            HOLDERS
          </Text>
          <Text fontSize="14px">{props.fee_basis_points}</Text>
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
          <Text fontSize="14px">120%</Text>
        </VStack>
        <Box position="absolute" bottom="0" right="0">
          <StarSticker />
        </Box>
      </Grid>
    </Stack>
  );
}

export default MainCard;
