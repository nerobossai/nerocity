import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { CiGlobe } from "react-icons/ci";
import { LiaTelegram } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";

import { SingleEye } from "@/components/Svgs/HomeScreen/singleEye";

interface ISuccessScreenProps {
  id: string;
  name: string;
  ticker: string;
  description: string;
  coins_percentage_for_dev: number;
  file: File | null;
  website?: string;
  telegram?: string;
}

function SuccessScreen(props: ISuccessScreenProps) {
  const router = useRouter();
  const tweetText =
    encodeURIComponent(`"🎭 YOOO! Just dropped $${props.ticker} on @nerocityai! 🔥
      🤪 What this bad boy can do:
      ${props.description}
      Find this absolute unit: https://nerocity.ai/${props.id}`);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <Stack
      borderRadius="1rem"
      gap="20px"
      width={{ md: "80vw", base: "auto" }}
      margin="auto"
      alignItems="center"
      justifyContent="center"
      px={{ lg: "20%", base: "0" }}
    >
      <VStack
        alignItems="start"
        justifyContent="start"
        margin="auto"
        gap="20px"
        width="100%"
      >
        <Box
          padding="1rem"
          width="100%"
          bg="#371E06"
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" top="-10" right="-10">
            <SingleEye />
          </Box>
          <VStack zIndex="1" alignItems="flex-start">
            {props.file ? (
              <Image
                src={URL.createObjectURL(props.file)}
                alt="Uploaded File"
                maxH="200px"
                objectFit="cover"
                borderRadius="md"
              />
            ) : (
              <></>
            )}
            <HStack gap="10px">
              <Text fontSize="2rem">{props.ticker}</Text>
              {props.website && (
                <a href={props.website} target="_blank">
                  <CiGlobe size={24} />
                </a>
              )}
              {props.telegram && (
                <a href={props.telegram} target="_blank">
                  <LiaTelegram size={24} />
                </a>
              )}
            </HStack>
            <Text mb="20px">{props.name}</Text>
            <Stack>
              <Text fontSize="12px" color="secondary">
                ABOUT
              </Text>
              <p>{props.description}</p>
            </Stack>
            <Stack mt="20px">
              <Text fontSize="12px" color="secondary">
                % of coins for dev
              </Text>
              <p>{props.coins_percentage_for_dev}%</p>
            </Stack>
          </VStack>
        </Box>
        <VStack my="20px" width="100%" alignItems="flex-start">
          <Text fontSize="12px" color="secondary">
            FEES
          </Text>
          <HStack justifyContent="space-between" width="100%">
            <Text>1.5 SOL</Text>
            <Text color="secondary">$245.12</Text>
          </HStack>
          <HStack justifyContent="space-between" width="100%">
            <Text>12.12 NEROBOSS</Text>
            <Text color="secondary">0.004SOL . $ 245.12</Text>
          </HStack>
        </VStack>

        <HStack width="100%" padding="20px" gap="20px" bg="#1B1B1D">
          <Image
            src="/assets/imgs/neroboss.png"
            alt="Uploaded File"
            maxH="50px"
            objectFit="cover"
            borderRadius="md"
          />
          <Text>
            NEROBOSS is the platform token for Nerocity. We&apos;ll
            automatically buy & burn NEROBOSS for you when you create an agent.
          </Text>
        </HStack>
        <Box
          padding="20px"
          bg="#202023"
          color="white"
          width="100%"
          display="flex"
          gap="10px"
          flexDirection={{ base: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text flexGrow="1">Share on X for maximum engagement</Text>
          <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
            <Button
              fontSize="12px"
              borderRadius="0"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              color="black"
              bg="white"
              gap="10px"
            >
              TWEET NOW <RiTwitterXFill />
            </Button>
          </a>
        </Box>
        <Box
          padding="20px"
          bg="#202023"
          color="white"
          width="100%"
          display="flex"
          gap="10px"
          flexDirection={{ base: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text flexGrow="1">Reply to your agent and get the feed going</Text>
          <Button
            fontSize="12px"
            borderRadius="0"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            color="black"
            bg="white"
            gap="10px"
            onClick={() => router.push("/")}
          >
            VIEW FEED
          </Button>
        </Box>
      </VStack>
    </Stack>
  );
}

export default SuccessScreen;
