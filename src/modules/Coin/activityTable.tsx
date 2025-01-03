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
import axios from "axios";
import React, { useEffect, useState } from "react";

import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";
import { timeDifference } from "@/utils/timeDifference";

import type { ActivityDetails } from "./services/coinApiClient";

function ActivityTable({ activities }: { activities: ActivityDetails[] }) {
  const [price, setPrice] = useState();
  const isMediumScreen = useBreakpointValue({ base: false, md: true });
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });

  const getSolUSDPrice = async () => {
    try {
      const resp = await axios.get(
        "https://api.martianwallet.xyz/v1/prices?ids=solana",
      );

      return resp.data.solana.usd;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  };

  useEffect(() => {
    async function getPrice() {
      const data = await getSolUSDPrice();
      setPrice(data);
    }

    getPrice();
  }, [activities]);

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
        <Thead
          fontSize="12px"
          color="#9B9B9B"
          textTransform="uppercase"
          border="0"
        >
          <Tr borderBottom="0">
            <Th color="text.100" textAlign="left">
              Account
            </Th>
            <Th color="text.100" textAlign="left">
              Activity
            </Th>
            {isLargeScreen && <Th color="text.100">Token</Th>}
            <Th color="text.100">SOL</Th>
            <Th color="text.100">Price(USD)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {activities.map((activity: ActivityDetails, id: number) => (
            <Box as="tr" key={id} display="table-row" mb="20px" fontSize="12px">
              <Td textAlign="left" color="white" border="0">
                <Text>{activity?.user?.slice(0, 6) ?? "--"}</Text>
              </Td>
              <Td textAlign="left" color="white" border="0">
                <Text>
                  <span
                    style={{ color: activity.is_buy ? "#18CA2A" : "#D31341" }}
                  >
                    {activity.is_buy ? "BUY" : "SELL"}
                  </span>{" "}
                  &nbsp;
                  {timeDifference(
                    Date.now(),
                    parseInt((activity.timestamp * 1000).toString(), 10),
                  )}
                </Text>
              </Td>
              {isLargeScreen && (
                <Td color="white" border="0">
                  <Text>{activity.token_amount / 1000000}</Text>
                </Td>
              )}
              <Td color="white" border="0">
                <Text>{activity.sol_amount / 1000000000}</Text>
              </Td>
              <Td color="white" border="0">
                <Text>
                  $
                  {(
                    Number(price) *
                    (Number(activity.sol_amount) / 1000000000)
                  ).toFixed(3)}
                </Text>
              </Td>
            </Box>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default ActivityTable;
