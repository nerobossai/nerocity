import { HStack, Progress, ProgressLabel, Stack, Text } from "@chakra-ui/react";
import React from "react";

function ProgressModule() {
  return (
    <Stack fontSize="12px" marginTop="1rem">
      <Progress
        colorScheme="green"
        height="2rem"
        value={60}
        borderRadius="20px"
        max={100}
      >
        <ProgressLabel fontSize="12px" marginLeft="1rem">
          60%
        </ProgressLabel>
      </Progress>
      <HStack justifyContent="space-between">
        <Text>0%</Text>
        <Text>50%</Text>
        <Text>100%</Text>
      </HStack>
    </Stack>
  );
}

export default ProgressModule;
