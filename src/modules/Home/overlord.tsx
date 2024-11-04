import { Stack, Text } from "@chakra-ui/react";
import React from "react";

import Card from "@/components/Card";

function OverlordModule() {
  // TODO: fetch data from api
  return (
    <Stack justifyContent="center" alignItems="center">
      <Text color="red.600" fontWeight="bold" fontSize="1.5rem" padding="1rem">
        AI Overlord
      </Text>
      <Card
        image="https://bit.ly/dan-abramov"
        createdBy="123456"
        marketCap="32k"
        createdAt={1730708878676}
        replies="10"
        name="Based frog"
        ticker="$TYBF"
        onClick={() => alert("coin clicked")}
      />
    </Stack>
  );
}

export default OverlordModule;
