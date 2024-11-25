import {
  Box,
  Button,
  HStack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import DataTable from "../Card/RowCard";
import { AllCoins } from "../Svgs/AllCoins";
import { GainerIcon } from "../Svgs/GainerIcon";
import { LoserIcon } from "../Svgs/LoserIcon";
import { MigrationIcon } from "../Svgs/MigrationIcon";

const buttonData = [
  { label: "All", bgColor: "white", icon: <AllCoins /> },
  { label: "Gainers", bgColor: "#1B1B1E", icon: <GainerIcon /> },
  { label: "Losers", bgColor: "#1B1B1E", icon: <LoserIcon /> },
  { label: "Migrated", bgColor: "#1B1B1E", icon: <MigrationIcon /> },
];

function CoinsTable({ feed }: any) {
  const isMediumScreen = useBreakpointValue({ base: false, md: true });
  return (
    <VStack width="100%" gap="1rem" marginTop="20px">
      <HStack
        justifyContent="space-between"
        width="100%"
        flexDirection={isMediumScreen ? "row" : "column"}
        gap="15px"
        alignItems="flex-start"
      >
        <Text className="knf" fontSize="18px">
          {feed.length} AGENTS LIVE
        </Text>
        <HStack gap="1rem">
          {buttonData.map((button, index) => (
            <Box key={index} position="relative" display="inline-block">
              <Button
                padding="4px 9px"
                fontSize="14px"
                bg={button.bgColor}
                color="text.100"
                borderRadius="0"
                border="0.5px solid #959595"
              >
                {button.label}
              </Button>
              <Box position="absolute" top="-10px" left="-10px">
                {button.icon}
              </Box>
            </Box>
          ))}
        </HStack>
      </HStack>
      <DataTable feed={feed} />
    </VStack>
  );
}

export default CoinsTable;
