import { Grid, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import type { CardProps } from "@/components/Card";
import CreatedAtComponent from "@/components/Created";
import { getTokenHolders } from "@/utils/getTokenHolders";

function AboutModule(
  props: CardProps & {
    sol_reserve: string | undefined;
    mint_public_key: string;
  },
) {
  const toast = useToast();
  const [holders, setHolders] = useState("");

  const handleMissingLink = (platform: string) => {
    toast({
      title: `No ${platform} linked by creator.`,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  useEffect(() => {
    const fetchHolders = async () => {
      const data = await getTokenHolders(props.mint_public_key);
      setHolders(data);
    };
    fetchHolders();
  }, []);
  return (
    <Stack
      fontSize="12px"
      spacing="1rem"
      marginTop="42px"
      border="1px solid #959595"
      padding="1rem"
      mb={{ base: "80px", lg: "0" }}
      width="100%"
    >
      <Text my="10px">DETAILS</Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
        <CreatedAtComponent
          timeStamp={parseInt(props.created_at.toString(), 10)}
          fontSize="12px"
          alignItems="flex-start"
        />
        <VStack gap="5px" alignItems="flex-start">
          <Text color="text.100">CREATOR</Text>
          <Text fontSize="12px" color="#00C2FF">
            {props.created_by}
          </Text>
        </VStack>
        <VStack gap="5px" alignItems="flex-start">
          <Text color="text.100">MCAP</Text>
          <Text fontSize="12px">${props.market_cap}</Text>
        </VStack>
        <VStack gap="5px" alignItems="flex-start">
          <Text color="text.100">HOLDERS</Text>
          <Text fontSize="12px">{holders ?? "--"}</Text>
        </VStack>

        <VStack gap="5px" alignItems="flex-start">
          <Text color="text.100">COMMENTS</Text>
          <Text fontSize="12px">{props.replies}</Text>
        </VStack>

        <VStack gap="5px" alignItems="flex-start">
          <Text color="text.100">24H</Text>
          <Text fontSize="12px">{props.twenty_four_hr_changes ?? "--"}</Text>
        </VStack>
      </Grid>

      <VStack alignItems="flex-start" gap="4px">
        <Text color="text.100">ABOUT</Text>
        <Text>{props.description}</Text>
      </VStack>
      {/* <HStack justifyContent="start" alignItems="start" spacing="1rem">
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
            {props.social && props.social.twitter ? (
              <Link href={`https://x.com/${props.social.twitter}`} isExternal>
                <RiTwitterXFill size="1.2rem" />
              </Link>
            ) : (
              <RiTwitterXFill
                size="1.2rem"
                onClick={() => handleMissingLink("Twitter")}
                cursor="pointer"
              />
            )}
            {props.social && props.social.telegram ? (
              <Link href={props.social?.telegram} isExternal>
                <LiaTelegram size="1.5rem" />
              </Link>
            ) : (
              <LiaTelegram
                size="1.5rem"
                onClick={() => handleMissingLink("Telegram")}
                cursor="pointer"
              />
            )}
          </HStack>
        </VStack>
      </HStack> */}
    </Stack>
  );
}

export default AboutModule;
