import { Box, Flex, Grid, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { BiComment } from "react-icons/bi";
import { FaChartLine, FaExchangeAlt, FaInfoCircle } from "react-icons/fa";

function TabBar({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (v: string) => void;
}) {
  const tabs = [
    { name: "Info", icon: FaInfoCircle },
    { name: "Charts", icon: FaChartLine },
    { name: "Buy/Sell", icon: FaExchangeAlt },
    { name: "Comments", icon: BiComment },
  ];

  return (
    <Box className="fixed bottom-0 h-[50px] w-full bg-[#0b0d0e] md:hidden">
      <Grid templateColumns="repeat(4, 1fr)" gap={2} height="100%">
        {tabs.map((tab) => (
          <Flex
            key={tab.name}
            direction="column"
            align="center"
            color="white"
            cursor="pointer"
            onClick={() => setSelectedTab(tab.name)}
            borderBottom={selectedTab === tab.name ? "2px solid white" : "none"}
            pb={2}
            justify="center" // Vertically center the items
          >
            <Icon as={tab.icon} boxSize={4} />
            <Text fontSize="8px" mt={1} color="primary">
              {tab.name}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
}

export default TabBar;
