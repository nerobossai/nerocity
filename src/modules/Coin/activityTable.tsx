import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import { timeDifference } from "@/utils/timeDifference";

import type { ActivityDetails } from "./services/coinApiClient";

function ActivityTable({ activities }: { activities: ActivityDetails[] }) {
  const isMediumScreen = useBreakpointValue({ base: false, md: true });
  if (activities.length === 0) {
    return (
      <Box
        width="100%"
        height="80px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        No recent Activity
      </Box>
    );
  }
  return (
    <VStack bg="#1B1B1E" width="100%" px="2rem">
      <Table as="table" width="100%">
        <Thead fontSize="12px" color="#9B9B9B" textTransform="uppercase">
          <Tr>
            <Th color="text.100" textAlign="left">
              Account
            </Th>
            <Th color="text.100" textAlign="left">
              Activity
            </Th>
            <Th color="text.100" textAlign="right">
              Value
            </Th>
            {isMediumScreen && <> <Th color="text.100" textAlign="right">
              SOL
            </Th>
            <Th color="text.100" textAlign="right">
              TXN
            </Th></>}
          </Tr>
        </Thead>
        <Tbody>
          {activities.map((activity: ActivityDetails, id: number) => (
            <Box as="tr" key={id} display="table-row" mb="20px" fontSize="12px">
              <Td textAlign="left" color="white" border="0">
                <Text>{activity?.username?.slice(0, 6) ?? "--"}</Text>
              </Td>
              <Td textAlign="left" color="white" border="0">
                <Text>
                  {timeDifference(
                    Date.now(),
                    parseInt((activity.timestamp*1000).toString(), 10),
                  )}
                </Text>
              </Td>
              <Td textAlign="right" color="white" border="0">
                <Text>{activity.token_amount}</Text>
              </Td>
              {isMediumScreen && <><Td textAlign="right" color="white" border="0">
                <Text>{activity.sol_amount}</Text>
              </Td>
              <Td textAlign="right" color="creator" border="0">
                <Text>{activity.tx_index}</Text>
              </Td></>}
            </Box>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default ActivityTable;
