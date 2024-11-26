import {
  Box,
  Button,
  HStack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import DataTable from "../Card/RowCard";
import { AllCoins } from "../Svgs/AllCoins";
import { GainerIcon } from "../Svgs/GainerIcon";
import { LoserIcon } from "../Svgs/LoserIcon";
import { MigrationIcon } from "../Svgs/MigrationIcon";

const buttonData = [
  { label: "All", icon: <AllCoins />, value: "" },
  { label: "Gainers", icon: <GainerIcon />, value: "gainers" },
  { label: "Losers", icon: <LoserIcon />, value: "losers" },
  { label: "Migrated", icon: <MigrationIcon />, value: "migrated" },
];

function CoinsTable({ feed, setFeedLoading, setFeed, filter, setFilter }: any) {
  const isMediumScreen = useBreakpointValue({ base: false, md: true });

  useEffect(() => {

  }, [])

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
                bg={button.value === filter ? "white" : "#1B1B1E"}
                color="text.100"
                borderRadius="0"
                border="0.5px solid #959595"
                onClick={() => setFilter(button.value)}
              >
                {button.label}
              </Button>
              {/* <Box position="absolute" top="-10px" left="-10px">
                {button.icon}
              </Box> */}
            </Box>
          ))}
        </HStack>
      </HStack>
      <DataTable feed={feed} />
    </VStack>
  );
}

export default CoinsTable;
