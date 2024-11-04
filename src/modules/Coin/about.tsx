import { HStack, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

export type CardProps = {
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

function AboutModule(props: CardProps) {
  return (
    <Stack fontSize="12px" spacing="1rem" marginTop="1rem">
      <HStack justifyContent="start" alignItems="start" spacing="1rem">
        <Image
          boxSize="5rem"
          objectFit="cover"
          src={props.image}
          alt="ai agent image"
          borderRadius="0.5rem"
        />
        <Stack>
          <Text>{props.description || ""}</Text>
        </Stack>
      </HStack>
      <Text>
        When the market cap reaches $69k all the liquidity from the bonding
        curve will be deposited into Raydium and burned. <br /> <br /> There are
        913,611,656.67 tokens still available for sale in the bonding curve, and
        there is 101.3 SOL in the bonding curve.
      </Text>
    </Stack>
  );
}

export default AboutModule;
