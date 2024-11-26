import {
  Box,
  HStack,
  Image,
  Link,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { CiStar } from "react-icons/ci";
import { FaCopy } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { LiaTelegram } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";

import type { CardProps } from "@/components/Card";

function CoinHeaderModule(props: CardProps) {
  const isLargeScreen = useBreakpointValue({ base: false, md: true });
  const router = useRouter();
  const toast = useToast();

  const handleMissingLink = (platform: string) => {
    toast({
      title: `No ${platform} linked by creator.`,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <HStack
      marginTop="1rem"
      justifyContent="space-between"
      alignItems={!isLargeScreen ? "flex-start" : "center"}
    >
      <Image
        boxSize={isLargeScreen ? "4rem" : "6rem"}
        objectFit="cover"
        src={props.image}
        alt="ai agent image"
      />
      <HStack
        flexGrow="1"
        alignItems="flex-start"
        spacing="4"
        flexDirection={isLargeScreen ? "row" : "column"}
      >
        <VStack alignItems="flex-start" gap="0">
          <Text fontSize="32px">{props.ticker}</Text>
          <Text fontSize="16px" mb="4px">{props.name}</Text>
        </VStack>

        <VStack justifyContent="flex-start" spacing="0" pt="10px">
          <HStack
            gap="15px"
            alignItems="flex-start"
            flexDirection={isLargeScreen ? "row" : "column"}
            width="100%"
            height="100%"
            flexWrap="wrap"
          >
            <Box
              display="flex"
              width="100%"
              gap="10px"
              alignItems="center"
              justifyContent="flex-start"
            >
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
            </Box>
            <Box
              display="flex"
              alignItems="center"
              fontSize="12px"
              gap="8px"
              color="secondary"
              wordBreak="break-all"
              // lineHeight="1"
              transform= "translateY(2px)"
            >
              CA:0x12389897989....oiui4{" "}
              <FaCopy
                onClick={() =>
                  navigator.clipboard.writeText("0x12389897989....oiui4")
                }
                className="cursor-pointer"
              />
            </Box>
            <HStack>
              <CiStar size={20} color="secondary" />
              <IoIosLink size={15} color="secondary" />
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </HStack>
  );
}

export default CoinHeaderModule;
