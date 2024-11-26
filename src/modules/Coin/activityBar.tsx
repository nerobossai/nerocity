import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useState } from "react";

import ActivityTable from "./activityTable";
import ChatModule from "./chats";
import TopHolders from "./topHolders";

function ActivityBar({
  agentId,
  replies,
}: {
  agentId: string;
  replies: string;
}) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Box width="100%">
      <Tabs index={activeTab} onChange={handleTabChange} variant="unstyled">
        <TabList
          borderBottom="1px solid #272727"
          borderTop="1px solid #272727"
          pt="10px"
          mt="10px"
        >
          <Tab
            _selected={{
              color: "white",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
            color={activeTab === 0 ? "white" : "#4A4A55"}
            borderBottom="2px solid"
            borderColor={activeTab === 0 ? "blue.500" : "transparent"}
            display="flex"
            alignItems="center"
            gap="5px"
          >
            <span>Comments</span>{" "}
            <Box
              borderRadius="20px"
              fontSize="10px"
              marginRight="15px"
              backgroundColor={activeTab === 0 ? "white" : "#4A4A55"} // Background color changes based on tab selection
              color={activeTab === 0 ? "black" : "#282828"}
              padding="2px 5px"
            >
              {replies}
            </Box>
          </Tab>
          <Tab
            _selected={{
              color: "white",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
            color={activeTab === 1 ? "white" : "#4A4A55"}
            borderBottom="2px solid"
            borderColor={activeTab === 1 ? "blue.500" : "transparent"}
          >
            Top Holders
          </Tab>
          <Tab
            _selected={{
              color: "white",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
            color={activeTab === 2 ? "white" : "#4A4A55"}
            borderBottom="2px solid"
            borderColor={activeTab === 2 ? "blue.500" : "transparent"}
          >
            Activity
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ChatModule agentId={agentId} />
          </TabPanel>
          <TabPanel>
            <TopHolders />
          </TabPanel>
          <TabPanel>
            <ActivityTable activities={[]} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default ActivityBar;
