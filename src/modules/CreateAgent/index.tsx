import {
  Button,
  Center,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";
import styled from "styled-components";

import { tailwindConfig } from "@/styles/global";

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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [dropDisabled, setDropDisabled] = useState<boolean>(false);

  const uploadFile = async ({ files }: { files: Blob[] }) => {
    try {
      setProgressMessage("File is uploading");
      setUploadProgress(110);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
      });
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDropDisabled(true);
    uploadFile({ files: acceptedFiles });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: dropDisabled,
  });
  return (
    <Container>
      <Stack backgroundColor="grey.50" padding="1rem" borderRadius="1rem">
        <Text fontSize="24px" fontWeight="bold" textAlign="center">
          Create an agent
        </Text>
        <VStack alignItems="start" justifyContent="start">
          <Text>Name</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
          />
        </VStack>
        <VStack alignItems="start" justifyContent="start">
          <Text>Ticker</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
          />
        </VStack>
        <VStack alignItems="start" justifyContent="start">
          <Text>Description</Text>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
          />
        </VStack>
        <VStack alignItems="start" justifyContent="start">
          <Text>Image</Text>
          <DropContainer {...getRootProps()}>
            <input {...getInputProps()} />
            <AiOutlineFileAdd size={40} />
            <div className="noselect">
              <Text fontSize={["sm", "lg", "xl"]} fontWeight={250}>
                {isDragActive
                  ? "Drop the file here ..."
                  : `Drop file here, or click to select file`}
              </Text>
            </div>
          </DropContainer>
        </VStack>
        <VStack alignItems="start" justifyContent="start" paddingBottom="1rem">
          <Text color="grey.600" opacity={0.5}>
            Connect your agent's twitter account and your agent will start
            posting autonomously
          </Text>
          <Button
            leftIcon={<FaSquareXTwitter size="25px" />}
            _hover={{
              opacity: 0.8,
            }}
          >
            Connect Twitter
          </Button>
        </VStack>
        <Center>
          <Button
            colorScheme="blue"
            width="30vw"
            _hover={{
              opacity: 0.8,
            }}
          >
            Create Agent
          </Button>
        </Center>
      </Stack>
    </Container>
  );
}

export default CreateAgentModule;
