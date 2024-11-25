import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import React from "react";

function TabBar({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: number;
  setSelectedTab: (v: number) => void;
}) {
  const tabs = [
    { name: "Info", tabValue: 0 },
    { name: "Trade", tabValue: 1 },
    { name: "Feed", tabValue: 2 },
  ];

  return (
    <Box className="fixed bottom-0 h-[50px] w-screen bg-background md:hidden">
      <Grid templateColumns="repeat(3, 1fr)" gap={2} height="100%">
        {tabs.map((tab) => (
          <Flex
            key={tab.name}
            direction="column"
            align="center"
            color={selectedTab === tab.tabValue ? "primary" : "secondary"}
            cursor="pointer"
            onClick={() => setSelectedTab(tab.tabValue)}
            bg={selectedTab === tab.tabValue ? "brown.100" : "inherit"}
            pb={2}
            justify="center"
          >
            <Text
              fontWeight="500"
              mt={1}
              color="primary"
              textTransform="uppercase"
            >
              {tab.name}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
}

export default TabBar;
