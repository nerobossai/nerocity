import { Box, Button, HStack, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Card from "@/components/Card";
import { Paths } from "@/constants/paths";
import { pumpFunSdk } from "@/services/pumpfun";

import OverlordModule from "./overlord";
import SearchModule from "./search";
import type { AgentResponse } from "./services/homeApiClient";
import { homeApiClient } from "./services/homeApiClient";
import MainCard from "@/components/Card/MainCard";
import CoinsTable from "@/components/CoinsTable";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

function HomeModule() {
  const navigator = useRouter();
  const [feedLoading, setFeedLoading] = useState(false);
  const [feed, setFeed] = useState<any>([]);
  const [overlord, setOverlord] = useState<AgentResponse>();

  const fetchFeed = async () => {
    try {
      setFeedLoading(true);
      const resp = await homeApiClient.feed();
      await Promise.all(
        resp.agents.map(async (data, idx) => {
          const tmp = await pumpFunSdk.getBondingCurveAccount(
            new PublicKey(data.mint_public_key),
          );
          const solPrice = await homeApiClient.solPrice();
          if (resp.agents[idx]) {
            resp.agents[idx].market_cap = (
              ((tmp?.getMarketCapSOL() || 0) / LAMPORTS_PER_SOL) *
              solPrice.solana.usd
            )
              .toFixed(3)
              .toString();

            resp.agents[idx].complete = tmp?.complete;
          }
        }),
      );
      const sortedAgents = [...resp.agents].sort(
        (a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap),
      );
      setOverlord(sortedAgents[0]);
      setFeed(resp.agents);
    } catch (err) {
      console.log(err);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <Container>
      <Stack justifyContent="center" alignItems="center">

        <Stack justifyContent="center" py="1rem" alignItems="center" marginBottom="20px" px="10%" gap="40px">
          {overlord && <MainCard {...overlord} />}
          <HStack width="100%" alignItems="center" bg="linear-gradient(100.39deg, #290D57 -0.99%, #653CA8 112.46%)" padding="20px" display="flex" justifyContent="space-between">
            <Text fontSize="24px" className="knf">
              Your agent can make it rain.
            </Text>
            <Button

              _hover={{
                opacity: 0.8,
              }}
              border="0"
              onClick={() => navigator.push(Paths.createAgent)}
            >
              CREATE AGENT
            </Button>
          </HStack>

        {feedLoading ? (
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60vh"
          >
            <Spinner />
          </Box>
        ) : (
          <CoinsTable feed={feed} />
          // <Stack
          //   marginTop="2rem"
          //   fontSize={{ base: "16px", sm: "12px" }}
          //   alignItems="flex-start"
          //   padding="1rem"
          // >
          //   <Button
          //     fontSize={{ base: "sm", md: "md", lg: "lg" }}
          //     colorScheme="blue"
          //     _hover={{
          //       opacity: 0.8,
          //     }}
          //     maxW={{ md: "200px", lg: "250px" }}
          //     margin={{ base: "0px", md: "20px" }}
          //   >
          //     sort: created at
          //   </Button>
          //   <SimpleGrid
          //     columns={{ base: 1, md: 1, lg: 3 }}
          //     spacing={10}
          //     padding={0}
          //     marginBottom={{ base: "40px", md: "40px" }}
          //     marginLeft={{ base: "0", md: "20px" }}
          //   >
          //     {feed.map((data: any) => {
          //       return parseFloat(data.market_cap) >= 0 ? (
          //         <Card {...data} key={data.id} />
          //       ) : null;
          //     })}
          //   </SimpleGrid>
          // </Stack>
        )}
                </Stack>

      </Stack>
    </Container>
  );
}

export default HomeModule;
