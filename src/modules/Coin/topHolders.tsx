import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";

function TopHolders() {
  return (
    <Box>
      <Table variant="unstyled">
        {" "}
        {/* No border style for the table */}
        <Thead fontSize="12px" color="#9B9B9B" textTransform="uppercase">
          <Tr>
            <Th>Account</Th>
            <Th>Value</Th>
            <Th>SOL</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Dummy Row 1 */}
          <Tr>
            <Td>Account1</Td>
            <Td>1000</Td>
            <Td>50</Td>
          </Tr>
          {/* Dummy Row 2 */}
          <Tr>
            <Td>Account2</Td>
            <Td>800</Td>
            <Td>40</Td>
          </Tr>
          {/* Dummy Row 3 */}
          <Tr>
            <Td>Account3</Td>
            <Td>1200</Td>
            <Td>60</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}

export default TopHolders;
