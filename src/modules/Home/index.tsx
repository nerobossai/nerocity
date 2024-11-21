import { Box, Button, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import MainCard from "@/components/Card/MainCard";
import CoinsTable from "@/components/CoinsTable";
import { pumpFunSdk } from "@/services/pumpfun";

import type { AgentResponse } from "./services/homeApiClient";
import { homeApiClient } from "./services/homeApiClient";
import { HomeSticker } from "@/components/Svgs/homeSticker";
import { Paths } from "@/constants/paths";

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
        <Stack
          justifyContent="center"
          py="1rem"
          alignItems="center"
          marginBottom="20px"
          px="10%"
          gap="40px"
        >
          {overlord && <MainCard {...overlord} />}
          <HStack
            width="100%"
            alignItems="center"
            bg="linear-gradient(100.39deg, #290D57 -0.99%, #653CA8 112.46%)"
            display="flex"
            justifyContent="space-between"
          >
            <Text fontSize="24px" className="knf" textTransform="uppercase" margin="20px">
              Your agent can make it rain.
            </Text>
            <Box flexGrow="1" display={{base:"none", lg: "block"}}>
              <HomeSticker />
            </Box>
            <Button
              _hover={{
                opacity: 0.8,
              }}
              borderRadius="0"
              onClick={() => navigator.push(Paths.createAgent)}
              margin="20px"
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
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default HomeModule;
