import { HStack, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

import type { CardProps } from "@/components/Card";

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
        curve will be deposited into Raydium and burned. <br /> <br /> There are{" "}
        {props.current_virtual_token_reserves || 0} tokens still available for
        sale in the bonding curve, and there is{" "}
        {(props.current_virtual_sol_reserves || 1 * 10 ** 9) / 10 ** 9} SOL in
        the bonding curve.
      </Text>
    </Stack>
  );
}

export default AboutModule;
