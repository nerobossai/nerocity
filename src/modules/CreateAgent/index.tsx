import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Input,
  Progress,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiTwitterXFill } from "react-icons/ri";
import styled from "styled-components";
import z from "zod";

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

const descriptionSchema = z
  .string()
  .min(50, "Minimum 50 characters is required.");

const tickerSchema = z
  .string()
  .regex(
    /^[A-Za-z]{1,6}$/,
    "Ticker must be 1-6 alphabetic characters with no spaces or numbers.",
  );

const linkSchema = z
  .string()
  .url("Please enter a valid URL.")
  .optional();

const predefinedTraits = ["Snarky", "Morose", "Nerdy", "Romantic", "Horror"];

const sampleData = {
  name: "Agent Name",
  ticker: "TICKER",
  description:
    "Hi, my name is marty and this is my complete description it does not matter how many lines or how big it is it willl all be shown here yayy",
  coins_percentage_for_dev: 10,
  file: null,
};

function CreateAgentModule() {
  const toast = useToast();
  const navigator = useRouter();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [ticker, setTicker] = useState("");
  const [mintPubKey, setMintPubKey] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [twitterLinking, setTwitterLinking] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [errors, setErrors] = useState<{ name?: string; ticker?: string; description?: string; website?: string; telegram?: string; }>({});
  const [tokenM, setTokenM] = useState<{
    metadata: TokenMetadata;
    metadataUri: string;
  }>();
  const [twtToken, setTwtToken] = useState<string>();
  const [screen, setScreen] = useState(2);
  const router = useRouter();

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [coinPercentage, setCoinPercentage] = useState<number>(0);
  const [promptDescription, setPromptDescription] = useState("");

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
    const descriptionValidation = descriptionSchema.safeParse(description);
    const websiteValidation = linkSchema.safeParse(website);
    const telegramValidation = linkSchema.safeParse(telegramHandle);
  
    if (file) {
      setImageError("");
    }

    if (!nameValidation.success || !tickerValidation.success || !descriptionValidation.success || (!telegramValidation.success && telegramHandle !== "") || (!websiteValidation.success && website !== "")) {
      setErrors({
        name: nameValidation.success
          ? undefined
          : nameValidation?.error?.issues[0]?.message,
        ticker: tickerValidation.success
          ? undefined
          : tickerValidation?.error?.issues[0]?.message,
        description: descriptionValidation.success
          ? undefined
          : descriptionValidation?.error?.issues[0]?.message,
        website: website === "" ? undefined : websiteValidation.success
          ? undefined
          : websiteValidation?.error?.issues[0]?.message,
        telegram: telegramHandle === "" ? undefined : telegramValidation.success
          ? undefined
          : telegramValidation?.error?.issues[0]?.message,
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
        // toast({
        //   title: "Error",
        //   description: "Please select image",
        //   status: "error",
        //   position: "bottom-right",
        // });
        setImageError("No image is selected!")
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
        website,
        prompt: promptDescription,
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
        coinPercentage*LAMPORTS_PER_SOL,
      );
      const txnResp = await sendTransaction(createResults, connection);
      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txnResp,
      });
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
      setMintPubKey(tokenMint.publicKey.toString());
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
      // navigator.replace(Paths.home);
      toast({
        title: "Success",
        description: "Ai Agent Coin launched",
        status: "success",
        position: "bottom-right",
      });
      setScreen(3);
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
  };

  const handleTwitterConnect = async () => {
    const nameValidation = nameSchema.safeParse(name);
    const tickerValidation = tickerSchema.safeParse(ticker);
    const descriptionValidation = descriptionSchema.safeParse(description);
    const websiteValidation = linkSchema.safeParse(website);
    const telegramValidation = linkSchema.safeParse(telegramHandle);
    console.log("t", nameValidation.success, tickerValidation.success);

    if (!nameValidation.success || !tickerValidation.success || !descriptionValidation.success || (!telegramValidation.success && telegramHandle !== "") || (!websiteValidation.success && website !== "")) {
      setErrors({
        name: nameValidation.success
          ? undefined
          : nameValidation?.error?.issues[0]?.message,
        ticker: tickerValidation.success
          ? undefined
          : tickerValidation?.error?.issues[0]?.message,
        description: descriptionValidation.success
          ? undefined
          : descriptionValidation?.error?.issues[0]?.message,
        website: website === "" ? undefined : websiteValidation.success
          ? undefined
          : websiteValidation?.error?.issues[0]?.message,
        telegram: telegramHandle === "" ? undefined : telegramValidation.success
          ? undefined
          : telegramValidation?.error?.issues[0]?.message,
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
        website: website,
        prompt: promptDescription,
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
      setScreen(2);
      setPromptDescription(twtData.prompt ?? '');
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
        maxWidth="1200px"
        margin="auto"
        mb="20px"
      >
        <Box
          width="100%"
          gap="20px"
          height="100%"
          padding="4px 9px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          className="knf"
        >
          <Text fontSize="18px" cursor="pointer">
            <span style={{ color: "#959595" }} onClick={() => router.push("/app")}>
              HOME /{" "}
            </span>{" "}
            CREATE AGENT
          </Text>
        </Box>
      </HStack>
      {screen === 1 ? (
        <PromptScreen
          handleGenerateAgent={handleGenerateAgent}
          loading={loading}
          description={promptDescription}
          setDescription={setPromptDescription}
        />
      ) : screen === 2 ? (
        <Stack borderRadius="1rem" gap="20px" maxWidth="1200px" margin="auto" minWidth={{ md: "500px", base: "100%" }}>
          {/* <Box
            width="100%"
            gap="20px"
            height="100%"
            px="1rem"
            py="24px"
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
                onClick={() => {
                  setPromptDescription("");
                  setScreen(1);
                }}
              >
                Regenerate
              </Button>
              <Button
                bg="#7E9C82"
                p="0.5rem"
                color="black"
                fontSize="12px"
                _hover={{ opacity: 0.8 }}
                onClick={handleRegenerate}
              >
                Start Over
              </Button>
            </HStack>
          </Box> */}
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px">
              Agent Name
            </Text>
            <Input
              backgroundColor="grey.100"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setName(e.target.value)}
              value={name}
              fontSize="16px"
              height="60px"
            />
            {errors.name && (
              <Text color="red.500" fontSize="12px">
                *{errors.name}
              </Text>
            )}
          </VStack>
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px">
              Ticker
            </Text>
            <Input
              backgroundColor="input"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              value={ticker}
              fontSize="16px"
              height="60px"
            />
            {errors.ticker && (
              <Text color="red.500" fontSize="12px">
                *{errors.ticker}
              </Text>
            )}
          </VStack>
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px">
              Biography
            </Text>
            <Textarea
              backgroundColor="input"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Enter your agent's origin story, personal traits, and defining characteristics. What drives them? What are their notable habits? This background shapes how your AI agent will engage with the community and approach market commentary"
              fontSize="14px"
              height="200px"
            />
            {errors.description && (
              <Text color="red.500" fontSize="12px">
                *{errors.description}
              </Text>
            )}
          </VStack>
          <VStack alignItems="start">
            <Text color="#4A4A55" fontSize="14px">
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
            {imageError && (
              <Text color="red.500" fontSize="12px">
                *{imageError}
              </Text>
            )}
          </VStack>
          {/* <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px">
              Traits
            </Text>
            <HStack flexWrap="wrap">
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
          </VStack> */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(1, 1fr)" }} gap={4}>
            <GridItem>
              <VStack alignItems="start" justifyContent="start">
                <Text color="#4A4A55" fontSize="14px">
                  Twitter/ X (optional)
                </Text>
                <Button
                  color="white"
                  _hover={{
                    opacity: 0.8,
                  }}
                  height="60px"
                  width="100%"
                  padding="1.5rem"
                  backgroundColor="#7E5313"
                  onClick={handleTwitterConnect}
                  opacity={twitterLinking ? 0.8 :  1}
                  // isLoading={twitterLinking}
                  disabled={!!twtToken}
                  display="flex"
                  justifyContent="start"
                  gap="20px"
                >
                  <RiTwitterXFill size="15px" />

                  <span>{twtToken ? "Connected Twitter/X" : twitterLinking ? "Connecting..." : "Connect Twitter/X"}</span>
                </Button>
              </VStack>
            </GridItem>
            {/* <GridItem>
              <VStack alignItems="start" justifyContent="start">
                <Text color="#4A4A55" fontSize="14px">
                  Telegram
                </Text>
                <Button
                  color="primary"
                  _hover={{
                    opacity: 0.8,
                  }}
                  height="60px"
                  width="100%"
                  padding="1.5rem"
                  backgroundColor="#7E5313"
                  onClick={handleTwitterConnect}
                  isLoading={twitterLinking}
                  disabled={!!twtToken}
                  display="flex"
                  justifyContent="start"
                  gap="20px"
                >
                  <LiaTelegram size="20px" />

                  <span>
                    {twtToken ? "Connected Telegram" : "Connect Telegram"}
                  </span>
                </Button>
              </VStack>
            </GridItem> */}
          </Grid>

          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px">
              Telegram Invite Link (optional)
            </Text>
            <Input
              backgroundColor="input"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setTelegramHandle(e.target.value)}
              value={telegramHandle}
              placeholder="Enter your Telegram Invite Link"
              fontSize="16px"
              height="60px"
            />
            {errors.telegram && (
              <Text color="red.500" fontSize="12px">
                *{errors.telegram}
              </Text>
            )}
          </VStack>

          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px">
              Website (optional)
            </Text>
            <Input
              backgroundColor="input"
              border={0}
              focusBorderColor="input"
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
              placeholder="Enter your AI agents website"
              fontSize="16px"
              height="60px"
            />
            {errors.website && (
              <Text color="red.500" fontSize="12px">
                *{errors.website}
              </Text>
            )}
          </VStack>
          <VStack alignItems="start" justifyContent="start">
            <Text color="#4A4A55" fontSize="14px">
              Enter the amount of SOL to spend to buy AI agent tokens
            </Text>
            <HStack width="100%">
              {[0.1, 0.5, 1, 2].map((trait) => (
                <Button
                  key={trait}
                  variant="solid"
                  fontSize="12px"
                  flexGrow="1"
                  flexWrap="wrap"
                  border={
                    coinPercentage === trait
                      ? "0.5px solid white"
                      : "0.5px solid #959595"
                  }
                  color={coinPercentage === trait ? "black" : "#959595"}
                  bg={coinPercentage === trait ? "white" : "#1B1B1D"}
                  onClick={() => setCoinPercentage(trait)}
                >
                  {trait}
                </Button>
              ))}
            </HStack>
            <Box position="relative" width="100%" mb="10px">
              {/* <Progress
                backgroundColor="#323232"
                color="white"
                height="36px"
                value={coinPercentage}
                width="100%"
              /> */}
              <Input 
                value={coinPercentage}
                type="number"
                backgroundColor="#323232"
                color="white"
                width="100%"
                border="none"
                textAlign="center"
                onChange={(e) => setCoinPercentage(Number(e.target.value))}
              />
            </Box>
          </VStack>
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
              // onClick={() => setScreen(3)}
              height="46px"
              color="white"
              marginBottom="20px"
            >
              Create Agent
            </Button>
          </Center>
        </Stack>
      ) : (
        <SuccessScreen
          telegram={telegramHandle}
          name={name}
          description={description}
          file={file}
          id={mintPubKey}
          ticker={ticker}
          coins_percentage_for_dev={coinPercentage}
          website={website}
        />
      )}
    </Container>
  );
}

export default CreateAgentModule;
