import { Box, Button, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { RiTwitterXFill } from "react-icons/ri";

function SuccessScreen() {
  return (
    <Stack
      borderRadius="1rem"
      gap="20px"
      width="80vw"
      margin="auto"
      alignItems="center"
      justifyContent="center"
      px={{ lg: "20%", md: "10%", base: "5%" }}
    >
      <VStack
        alignItems="start"
        justifyContent="start"
        margin="auto"
        gap="20px"
        width="100%"
      >
        <Box bg="#1A053A" padding="1rem" width="100%">
          {/* <CoinHeaderModule /> */}

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
            onClick={() => {}}
          >
            <Text>GO TO AGENT PAGE</Text>
          </Button>
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
          <Text flexGrow="1">Share on X for maximum engagement</Text>
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
          >
            VIEW FEED
          </Button>
        </Box>
      </VStack>
    </Stack>
  );
}

export default SuccessScreen;
