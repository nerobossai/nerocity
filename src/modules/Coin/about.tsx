import { HStack, Image, Link, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { LiaTelegram } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";

import type { CardProps } from "@/components/Card";

function AboutModule(props: CardProps & { sol_reserve: string | undefined }) {
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
        <VStack>
          <Text>{props.description || ""}</Text>
          <HStack justifyContent="start" width="100%">
            {props.social && props.social.twitter && (
              <Link href={props.social.twitter} isExternal>
                <RiTwitterXFill size="1.2rem" />
              </Link>
            )}
            {props.social && props.social.telegram && (
              <Link href={props.social?.telegram} isExternal>
                <LiaTelegram size="1.5rem" />
              </Link>
            )}
          </HStack>
        </VStack>
      </HStack>
      <Text>
        When the market cap reaches $69k all the liquidity from the bonding
        curve will be deposited into Raydium and burned. <br /> <br /> There are{" "}
        {props.current_real_token_reserves || 0} tokens still available for sale
        in the bonding curve, and there is {props.sol_reserve || 0} SOL in the
        bonding curve.
      </Text>
    </Stack>
  );
}

export default AboutModule;
