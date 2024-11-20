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
import SubscriptText from "@/components/SubscriptText";
import { getSolScanLink } from "@/utils";
import { timeDifference } from "@/utils/timeDifference";
import { truncateString } from "@/utils/truncateString";

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

  if (!isLargeScreen) {
    return (
      <>
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
            <Text
              onClick={() => router.push(`/profile/${props.created_by}`)}
              cursor="pointer"
            >
              @{props.created_by}
            </Text>
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
      </>
    );
  }

  return (
    <HStack marginTop="1rem" justifyContent="space-between">
      <Image
        boxSize="4rem"
        objectFit="cover"
        src={props.image}
        alt="ai agent image"
      />
      <HStack flexGrow="1" alignItems="flex-start" spacing="4">
        <VStack alignItems="flex-start">
          <Text fontSize="32px">{props.ticker}</Text>
          <Text fontSize="16px">{props.name}</Text>
        </VStack>

        <VStack justifyContent="flex-start" spacing="0" pt="10px">
          <HStack spacing="2" alignItems="center">
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
            <Box
              bg="#25252B"
              padding="5px 10px"
              display="flex"
              alignItems="center"
              gap="8px"
            >
              CA: 0x12389897989....oiui4{" "}
              <FaCopy
                onClick={() =>
                  navigator.clipboard.writeText("0x12389897989....oiui4")
                }
                className="cursor-pointer"
              />
            </Box>
            <CiStar />
            <IoIosLink />
          </HStack>
        </VStack>
      </HStack>
    </HStack>
  );
}

export default CoinHeaderModule;
