import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiTwitterXFill } from "react-icons/ri";
import styled from "styled-components";
import z from "zod";

import { Paths } from "@/constants/paths";
import { pumpFunSdk } from "@/services/pumpfun";
import type { CreateTokenMetadata, TokenMetadata } from "@/services/types";
import { tailwindConfig } from "@/styles/global";
import { logger } from "@/utils/Logger";

import PromptScreen from "./promptScreen";
import { agentApiClient } from "./services/agentApiClient";
import { trackAgentCreation } from "./services/analytics";
import SuccessScreen from "./successScreen";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  maxwidth: 1200px;
  margin: auto;
  gap: 10px;
`;

const DropContainer = styled.div`
  width: 100%;
  height: 30vh;

  /* padding: 3rem; */
  background-color: ${() => {
    // @ts-ignore we are sure that this key will present
    return tailwindConfig.theme?.colors.grey["100"];
  }};
  border-radius: 0.3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const nameSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9]+$/,
    "Name can only contain letters and numbers with no spaces.",
  )
  .min(1, "Name is required.");

const tickerSchema = z
  .string()
  .regex(
    /^[A-Za-z]{1,6}$/,
    "Ticker must be 1-6 alphabetic characters with no spaces or numbers.",
  );

const predefinedTraits = ["Snarky", "Morose", "Nerdy", "Romantic", "Horror"];

function CreateAgentModule() {
  const toast = useToast();
  const navigator = useRouter();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [twitterLinking, setTwitterLinking] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; ticker?: string }>({});
  const [tokenM, setTokenM] = useState<{
    metadata: TokenMetadata;
    metadataUri: string;
  }>();
  const [twtToken, setTwtToken] = useState<string>();
  const [traits, setTraits] = useState([]);
  const [screen, setScreen] = useState(1);
  const router = useRouter();

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((item) => item !== trait)
        : [...prev, trait],
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0] ?? null);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: false,
    multiple: false,
  });

  const handleSubmit = async () => {
    const nameValidation = nameSchema.safeParse(name);
    const tickerValidation = tickerSchema.safeParse(ticker);
    console.log("t", nameValidation.success, tickerValidation.success);

    if (!nameValidation.success || !tickerValidation.success) {
      setErrors({
        name: nameValidation.success
          ? undefined
          : nameValidation?.error?.issues[0]?.message,
        ticker: tickerValidation.success
          ? undefined
          : tickerValidation?.error?.issues[0]?.message,
      });
      return;
    }

    setErrors({});
    try {
      if (!publicKey) {
        toast({
          title: "Error",
          description: "Please connect wallet first",
          status: "error",
          position: "bottom-right",
        });
        return;
      }

      if (!file && !tokenM) {
        toast({
          title: "Error",
          description: "Please select image",
          status: "error",
          position: "bottom-right",
        });
        return;
      }

      setLoading(true);

      const tokenMint = Keypair.generate();

      const createTokenMetadata: CreateTokenMetadata = {
        name,
        symbol: ticker,
        description,
        file: file!,
        // twitter: twitterHandle,
        telegram: telegramHandle,
        // website?: string;
      };

      let tMeta;

      if (tokenM) {
        tMeta = tokenM;
      } else {
        tMeta = await pumpFunSdk.createTokenMetadata(createTokenMetadata);
      }

      const { createResults, tokenMetadata } = await pumpFunSdk.createAndBuy(
        publicKey,
        tokenMint,
        tMeta,
        0,
      );
      const txnResp = await sendTransaction(createResults, connection);
      // await connection.confirmTransaction(txnResp, "confirmed");
      // send txn to wallet for signing
      await agentApiClient.launch({
        name,
        description,
        ticker,
        image: tokenMetadata.image,
        mintPublicKey: tokenMint.publicKey.toString(),
        tokenMetadata,
        twtToken,
        txnHash: txnResp,
      });
      trackAgentCreation({
        agent_address: tokenMint.publicKey.toString(),
        timestamp: Date.now(),
        agent_details: {
          name,
          description,
          ticker,
          image: tokenMetadata.image,
          tokenMetadata,
        },
      });
      navigator.replace(Paths.home);
      toast({
        title: "Success",
        description: "Ai Agent Coin launched",
        status: "success",
        position: "bottom-right",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "unable to create Agent, check txn status in solscan",
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setName("");
    setDescription("");
    setTicker("");
    setScreen(1);
  };

  const handleTwitterConnect = async () => {
    const nameValidation = nameSchema.safeParse(name);
    const tickerValidation = tickerSchema.safeParse(ticker);
    console.log("t", nameValidation.success, tickerValidation.success);

    if (!nameValidation.success || !tickerValidation.success) {
      setErrors({
        name: nameValidation.success
          ? undefined
          : nameValidation?.error?.issues[0]?.message,
        ticker: tickerValidation.success
          ? undefined
          : tickerValidation?.error?.issues[0]?.message,
      });
      return;
    }

    setErrors({});
    try {
      if (!publicKey) {
        toast({
          title: "Error",
          description: "Please connect wallet first",
          status: "error",
          position: "bottom-right",
        });
        return;
      }

      if (!file) {
        toast({
          title: "Error",
          description: "Please select image",
          status: "error",
          position: "bottom-right",
        });
        return;
      }

      setTwitterLinking(true);

      const createTokenMetadata: CreateTokenMetadata = {
        name,
        symbol: ticker,
        description,
        file: file!,
        // twitter: twitterHandle,
        telegram: telegramHandle,
        // website?: string;
      };

      const tMeta = await pumpFunSdk.createTokenMetadata(createTokenMetadata);

      // send txn to wallet for signing
      const data = await agentApiClient.getTwitterOauthLink({
        name,
        description,
        ticker,
        image: tMeta.metadata.image,
        tokenMetadata: tMeta,
        telegram: telegramHandle,
      });
      window.open(data.authUrl, "_self");
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "unable to link twitter",
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setTwitterLinking(false);
    }
  };

  const validateTwtCb = async () => {
    try {
      setTwitterLinking(true);
      const { twtcb, oauth_token, oauth_verifier } = navigator.query;
      const twtData = await agentApiClient.validateOauth({
        oauthToken: oauth_token as string,
        oauthVerifier: oauth_verifier as string,
      });
      setTicker(twtData.ticker);
      setName(twtData.name);
      setDescription(twtData.description);
      setTelegramHandle(twtData.telegram || "");
      setTokenM(twtData.tokenMetadata);
      setTwtToken(twtData.twtToken);
    } catch (err) {
      logger.error(err);
    } finally {
      setTwitterLinking(false);
    }
  };

  useEffect(() => {
    if (navigator.query.twtcb === "true") {
      validateTwtCb();
    }
  }, [navigator]);

  const handleGenerateAgent = async (description: string) => {
    setLoading(true);
    setTimeout(() => {
      setScreen(2);
      setLoading(false);
    }, 1000);
  };

  // if (loading) {
  //   return (<Box
  //     width="80vw"
  //     margin="auto"
  //     display="flex"
  //     justifyContent="center"
  //     alignItems="center"
  //     height="100px"
  //   >
  //     <Spinner />
  //   </Box>)
  // }
  return (
    <Container>
      <HStack
        width="100%"
        px={{ base: "0", md: "10%" }}
        alignItems="center"
        py="1rem"
      >
        <Box
          display="flex"
          alignItems="center"
          gap="20px"
          cursor="pointer"
          marginLeft="40px"
          onClick={() => router.push("/")}
        >
          <IoArrowBackSharp />
          <Text>BACK</Text>
        </Box>
      </HStack>
      {screen === 1 ? (
        <PromptScreen
          handleGenerateAgent={handleGenerateAgent}
          loading={loading}
        />
      ) : screen === 2 ? (
        <Stack borderRadius="1rem" gap="20px" maxWidth="1200px" margin="auto">
          <Box
            width="100%"
            gap="20px"
            height="100%"
            px="1rem"
            py="20px"
            display="flex"
            bg="#021F05"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Text>Agent generated! You can edit specific values</Text>
            <HStack gap="20px">
              <Button
                bg="primary"
                p="0.5rem"
                color="black"
                fontSize="12px"
                _hover={{ opacity: 0.8 }}
                onClick={handleRegenerate}
              >
                Regenerate
              </Button>
              <Button
                bg="#7E9C82"
                p="0.5rem"
                color="black"
                fontSize="12px"
                _hover={{ opacity: 0.8 }}
              >
                Start Over
              </Button>
            </HStack>
          </Box>
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px" textTransform="uppercase">
              Agent Name & PFP
            </Text>
            <Input
              backgroundColor="grey.100"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setName(e.target.value)}
              value={name}
              fontSize="16px"
              height="60px"
              textTransform="uppercase"
            />
            {errors.name && (
              <Text color="red.500" fontSize="12px" textTransform="uppercase">
                *{errors.name}
              </Text>
            )}
          </VStack>
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px" textTransform="uppercase">
              Ticker
            </Text>
            <Input
              backgroundColor="input"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setTicker(e.target.value)}
              value={ticker}
              fontSize="16px"
              height="60px"
              textTransform="uppercase"
            />
            {errors.ticker && (
              <Text color="red.500" fontSize="12px" textTransform="uppercase">
                *{errors.ticker}
              </Text>
            )}
          </VStack>
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px" textTransform="uppercase">
              Biography
            </Text>
            <Input
              backgroundColor="input"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              fontSize="16px"
              height="60px"
              textTransform="uppercase"
            />
          </VStack>
          <VStack alignItems="start">
            <Text color="#4A4A55" fontSize="14px" textTransform="uppercase">
              Add Image
            </Text>
            <Box
              display="flex"
              alignItems="center"
              backgroundColor="grey.100"
              p={2}
              borderRadius="md"
              {...getRootProps()}
              width="100%"
            >
              <Button
                as="span"
                colorScheme="teal"
                size="sm"
                height="45px"
                padding="2rem"
                backgroundColor="grey.75"
                _hover={{ backgroundColor: "grey.75" }}
                cursor="pointer"
                textTransform="uppercase"
              >
                Choose file
              </Button>
              <input
                id="file-upload"
                style={{ display: "none" }}
                {...getInputProps()}
              />
              {tokenM
                ? tokenM.metadata.name
                : file && (
                    <Text ml={3} p={2} borderRadius="md" fontSize="sm">
                      {file.name}
                    </Text>
                  )}
            </Box>
          </VStack>
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px" textTransform="uppercase">
              Traits
            </Text>
            <HStack>
              {predefinedTraits.map((trait) => (
                <Button
                  key={trait}
                  variant="solid"
                  fontSize="12px"
                  color={selectedTraits.includes(trait) ? "#141415" : "#818181"}
                  bg={selectedTraits.includes(trait) ? "white" : "#353535"}
                  onClick={() => toggleTrait(trait)}
                >
                  {trait}
                </Button>
              ))}
            </HStack>
          </VStack>
          <VStack
            alignItems="start"
            justifyContent="start"
            textTransform="uppercase"
          >
            <Text color="#4A4A55" fontSize="14px">
              Twitter (optional) Your AI Agent will tweet every 30 minutes.
            </Text>
            <Button
              color="primary"
              _hover={{
                opacity: 0.8,
              }}
              height="60px"
              width="100%"
              padding="1.5rem"
              backgroundColor="#4F4FCF"
              onClick={handleTwitterConnect}
              isLoading={twitterLinking}
              disabled={!!twtToken}
              display="flex"
              justifyContent="space-between"
              textTransform="uppercase"
            >
              <span>
                {twtToken ? "connected" : "Connect Twitter/X account"}
              </span>
              <RiTwitterXFill size="15px" />
            </Button>
            <Text
              color="grey.600"
              opacity={0.5}
              fontSize="12px"
              textTransform="uppercase"
            >
              *Connect your agent's twitter account and your agent will start
              posting autonomously
            </Text>
          </VStack>
          {/* <VStack alignItems="start" justifyContent="start" paddingBottom="1rem">
          <Text>Telegram (optional)</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="input"
            onChange={(e) => setTelegramHandle(e.target.value)}
            value={telegramHandle}
          />
        </VStack> */}
          <Center>
            <Button
              width="100%"
              _hover={{
                opacity: 0.8,
              }}
              bg="#18CA2A"
              border="1px solid #1FEF34"
              isLoading={loading}
              onClick={handleSubmit}
              height="46px"
              color="white"
              textTransform="uppercase"
              marginBottom="20px"
            >
              Create Agent
            </Button>
          </Center>
        </Stack>
      ) : (
        <SuccessScreen />
      )}
    </Container>
  );
}

export default CreateAgentModule;
