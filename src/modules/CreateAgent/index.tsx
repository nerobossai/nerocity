import {
  Box,
  Button,
  Center,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import { Paths } from "@/constants/paths";
import { pumpFunSdk } from "@/services/pumpfun";
import type { CreateTokenMetadata } from "@/services/types";
import { tailwindConfig } from "@/styles/global";

import { agentApiClient } from "./services/agentApiClient";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
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
  const [twitterHandle, setTwitterHandle] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

      setLoading(true);

      const tokenMint = Keypair.generate();

      const createTokenMetadata: CreateTokenMetadata = {
        name,
        symbol: ticker,
        description,
        file: file!,
        twitter: twitterHandle,
        telegram: telegramHandle,
        // website?: string;
      };

      const { createResults, tokenMetadata } = await pumpFunSdk.createAndBuy(
        publicKey,
        tokenMint,
        createTokenMetadata,
        0,
      );
      const txnResp = await sendTransaction(createResults, connection);
      // send txn to wallet for signing
      await agentApiClient.launch({
        name,
        description,
        ticker,
        image: tokenMetadata.image,
        mintPublicKey: tokenMint.publicKey.toString(),
        tokenMetadata,
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
        description: "Something went wrong!",
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Stack
        backgroundColor="grey.50"
        padding="2rem"
        borderRadius="1rem"
        gap="20px"
      >
        <Text fontSize="24px" fontWeight="bold" textAlign="center">
          Create an agent
        </Text>
        <VStack alignItems="start" justifyContent="start">
          <Text>Name</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </VStack>
        <VStack alignItems="start" justifyContent="start">
          <Text>Ticker</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
            onChange={(e) => setTicker(e.target.value)}
            value={ticker}
          />
        </VStack>
        <VStack alignItems="start" justifyContent="start">
          <Text>Description</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </VStack>
        <VStack alignItems="start">
          <Text>Add Image</Text>
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
            {file && (
              <Text ml={3} p={2} borderRadius="md" fontSize="sm">
                {file.name}
              </Text>
            )}
          </Box>
        </VStack>
        <VStack alignItems="start" justifyContent="start">
          <Text>Twitter (optional)</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
            onChange={(e) => setTwitterHandle(e.target.value)}
            value={twitterHandle}
          />
          <Text color="grey.600" opacity={0.5} fontSize="12px">
            *Connect your agent's twitter account and your agent will start
            posting autonomously
          </Text>
        </VStack>
        {/* <Button
            leftIcon={<FaSquareXTwitter size="25px" />}
            _hover={{
              opacity: 0.8,
            }}
          >
            Connect Twitter
        </Button> */}
        <VStack alignItems="start" justifyContent="start" paddingBottom="1rem">
          <Text>Telegram (optional)</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
            onChange={(e) => setTelegramHandle(e.target.value)}
            value={telegramHandle}
          />
        </VStack>
        <Center>
          <Button
            width={{ base: "auto", md: "20vw" }}
            _hover={{
              opacity: 0.8,
            }}
            isLoading={loading}
            onClick={handleSubmit}
          >
            Create my Agent
          </Button>
        </Center>
      </Stack>
    </Container>
  );
}

export default CreateAgentModule;
