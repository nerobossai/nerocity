import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

import DataTable from "../Card/RowCard";
import { GainerIcon } from "../Svgs/GainerIcon";
import { AllCoins } from "../Svgs/AllCoins";
import { LoserIcon } from "../Svgs/LoserIcon";
import { MigrationIcon } from "../Svgs/MigrationIcon";

function CoinsTable({ feed }: any) {
  return (
    <VStack width="100%" gap="1rem" marginTop="20px">
      <HStack justifyContent="space-between" width="100%">
        <Text className="knf" fontSize="18px">
          {feed.length} AGENTS LIVE
        </Text>
        <HStack gap="1rem">
          <Box position="relative" display="inline-block">
            <Button padding="4px" fontSize="14px" bg="white" color="text.100">
              All
            </Button>
            <Box position="absolute" top="-10px" left="-10px">
              <AllCoins />
            </Box>
          </Box>
          <Box position="relative" display="inline-block">
            <Button padding="4px" fontSize="14px" bg="#1B1B1E" color="text.100">
              Gainers
            </Button>
            <Box position="absolute" top="-10px" left="-10px">
              <GainerIcon />
            </Box>
          </Box>
          <Box position="relative" display="inline-block">
            <Button padding="4px" fontSize="14px" bg="#1B1B1E" color="text.100">
              Losers
            </Button>
            <Box position="absolute" top="-10px" left="-10px">
              <LoserIcon />
            </Box>
          </Box>
          <Box position="relative" display="inline-block">
            <Button padding="4px" fontSize="14px" bg="#1B1B1E" color="text.100">
              Migrated
            </Button>
            <Box position="absolute" top="-10px" left="-10px">
              <MigrationIcon />
            </Box>
          </Box>
        </HStack>
      </HStack>
      <DataTable feed={feed} />
    </VStack>
  );
}

export default CoinsTable;
