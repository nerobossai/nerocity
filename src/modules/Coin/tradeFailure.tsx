import { Box, Button, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { IoRefresh } from "react-icons/io5";

import { FailedTrade } from "@/components/Svgs/failedTrade";

function TradeFailure({
  setScreenNumber,
}: {
  setScreenNumber: (v: number) => void;
}) {
  return (
    <Stack
      spacing="0.5rem"
      padding="1rem"
      backgroundColor="#1F0204"
      gap="1rem"
      borderRadius="0.5rem"
      justifyContent="space-between"
      position="relative"
      height="428px"
    >
      <Box position="absolute" right="0" bottom="0">
        <FailedTrade />
      </Box>
      <Text fontSize="48px" zIndex={1}>
        TXN FAILED
      </Text>
      <Button
        padding="12px 16px"
        bg="white"
        color="black"
        borderRadius="0"
        display="flex"
        gap="10px"
        alignItems="center"
        onClick={() => setScreenNumber(0)}
      >
        <IoRefresh />
        <Text>Retry</Text>
      </Button>
    </Stack>
  );
}

export default TradeFailure;
