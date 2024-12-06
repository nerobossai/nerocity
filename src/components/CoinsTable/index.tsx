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

const buttonData = [
  { label: "All", value: "" },
  { label: "Gainers", value: "gainers" },
  { label: "Losers", value: "losers" },
  { label: "Migrated", value: "migrated" },
  { label: "X-Born Agents", value: "xfeed" }
];

function CoinsTable({ feed, setFeedLoading, setFeed, filter, setFilter }: any) {
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
          {feed.length} {filter} THIS WEEK
        </Text>
        <HStack gap="1rem" flexWrap="wrap">
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
