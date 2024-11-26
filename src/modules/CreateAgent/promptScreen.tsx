import { Button, Stack, Text, Textarea, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CiWallet } from "react-icons/ci";

interface IPromptScreen {
  handleGenerateAgent: (v: string) => void;
  loading: boolean;
  description: string;
  setDescription: (v: string) => void;
}
function PromptScreen({
  handleGenerateAgent,
  loading,
  description,
  setDescription,
}: IPromptScreen) {
  const [error, setError] = useState("");
  return (
    <Stack
      borderRadius="1rem"
      gap="20px"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <VStack
        alignItems="start"
        justifyContent="start"
        margin="auto"
        width={{ base: "100%", md: "500px" }}
      >
        <Text color="#4A4A55" fontSize="14px" textTransform="uppercase">
          Description for your ideal agent
        </Text>
        <Textarea
          backgroundColor="#1F1F22"
          border={0}
          focusBorderColor="input"
          onChange={(e) => setDescription(e.target.value)}
          fontSize="16px"
          value={description}
          width="100%"
          height="500px"
          textTransform="uppercase"
          resize="none"
          placeholder="Enter description. Be as long and detailed as you want. You can always edit your generated agent"
        />
        {error && (
          <Text color="red.500" fontSize="12px" textTransform="uppercase">
            *{error}
          </Text>
        )}
        <Button
          width="100%"
          color="white"
          marginTop="20px"
          border="0.5px solid #1FEF34"
          padding="1rem"
          textAlign="center"
          bg="#18CA2A"
          display="flex"
          justifyContent="center"
          gap="20px"
          _hover={{ opacity: 0.8 }}
          opacity={loading ? 0.8 : 1}
          disabled={loading}
          onClick={() => {
            if (!description) {
              setError("Please enter description!");
            } else {
              handleGenerateAgent(description);
            }
          }}
        >
          <CiWallet size={20} />
          <Text>{loading ? "GENERATING" : "GENERATE AGENT"}</Text>
        </Button>
      </VStack>
    </Stack>
  );
}

export default PromptScreen;
