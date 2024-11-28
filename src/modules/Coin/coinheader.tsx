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
import React, { useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaCheckCircle, FaCopy } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { LiaTelegram } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";

import type { CardProps } from "@/components/Card";

function extractFirstAndLastFour(url: string) {
  const extractedPart = url.split('/').pop();

  const first4 = extractedPart?.slice(0, 4);
  const last4 = extractedPart?.slice(-4);

  return first4 + "...." + last4
};

function CoinHeaderModule(props: CardProps) {
  const isLargeScreen = useBreakpointValue({ base: false, md: true });
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href.split('/').pop() as string);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000)
  }

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
          <Text fontSize="32px">${props.ticker}</Text>
          <Text fontSize="16px" mb="4px">
            {props.name}
          </Text>
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
              {props.social && props.social.website ? (
                <Link href={props.social?.website} isExternal>
                  <AiOutlineGlobal size="1.5rem" />
                </Link>
              ) : (
                <AiOutlineGlobal
                  size="1.5rem"
                  onClick={() => handleMissingLink("Website")}
                  cursor="pointer"
                />
              )}
              <Box
                display={{ base: "none", lg: "flex" }}
                alignItems="center"
                fontSize="12px"
                gap="8px"
                color="secondary"
                wordBreak="break-all"
                // lineHeight="1"
                transform="translateY(2px)"
              >
                <HStack cursor="pointer" onClick={handleCopy}>
                  <Text>CA:{extractFirstAndLastFour(window.location.href)}{" "}</Text>
                  {copied ? <FaCheckCircle /> : <FaCopy
                    className="cursor-pointer"
                  />}
                </HStack>
                <a href={"https://solscan.io/account/" + window.location.href.split('/').pop()} target="_blank" rel="noopener noreferrer">
                  <IoIosLink size={15} style={{ marginLeft: "6px" }} />
                </a>
              </Box>
            </Box>
            <Box
              display={{ base: "flex", lg: "none" }}
              alignItems="center"
              fontSize="12px"
              gap="8px"
              color="secondary"
              wordBreak="break-all"
              // lineHeight="1"
              transform="translateY(2px)"
            >
              CA:{extractFirstAndLastFour(window.location.href)}{" "}
              <FaCopy
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href.split('/').pop() as string)
                }
                className="cursor-pointer"
              />
              <IoIosLink size={15} />
            </Box>

            {/* <HStack>
              <CiStar size={20} color="secondary" />
              <IoIosLink size={15} color="secondary" />
            </HStack> */}
          </HStack>
        </VStack>
      </HStack>
    </HStack>
  );
}

export default CoinHeaderModule;
