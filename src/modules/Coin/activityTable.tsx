import { Box, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import React from "react";

interface ActivityProps {
  id: string;
  account: string;
  activity: string;
  value: string;
  sol: string;
  txn: string;
}

function ActivityTable({ activities }: { activities: ActivityProps[] }) {
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
            <Th color="text.100" textAlign="right">
              SOL
            </Th>
            <Th color="text.100" textAlign="right">
              TXN
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {activities.map((activity: ActivityProps) => (
            <Box
              as="tr"
              key={activity.id}
              display="table-row"
              bg="#242424"
              mb="20px" // Gap between rows
              border="1px solid #343434"
              borderRadius="8px" // Optional rounded corners
            >
              {/* Account Column */}
              <Td textAlign="left" color="white">
                <Text>{activity.account}</Text>
              </Td>
              {/* Activity Column */}
              <Td textAlign="left" color="white">
                <Text>{activity.activity}</Text>
              </Td>
              {/* Value Column */}
              <Td textAlign="right" color="white">
                <Text>{activity.value}</Text>
              </Td>
              {/* SOL Column */}
              <Td textAlign="right" color="white">
                <Text>{activity.sol}</Text>
              </Td>
              {/* TXN Column */}
              <Td textAlign="right" color="white">
                <Text>{activity.txn}</Text>
              </Td>
            </Box>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default ActivityTable;
