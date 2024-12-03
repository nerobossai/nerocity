import {
  Box,
  Button,
  HStack,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import MainCard from "@/components/Card/MainCard";
import CoinsTable from "@/components/CoinsTable";
import { HomeSticker } from "@/components/Svgs/homeSticker";
import { Paths } from "@/constants/paths";
import { pumpFunSdk } from "@/services/pumpfun";
import { useScreenStore } from "@/stores/useScreenStore";
import { useSearchStore } from "@/stores/useSearchStore";
import useUserStore from "@/stores/useUserStore";
import { getTokenHolders } from "@/utils/getTokenHolders";
import useDebounce from "@/utils/useDebounce";

import MainScreen from "./mainScreen";
import type { AgentResponse } from "./services/homeApiClient";
import { homeApiClient } from "./services/homeApiClient";
import TimerScreen from "@/components/Banner/timer";

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
  const { searchText } = useSearchStore();
  const [overlord, setOverlord] = useState<AgentResponse>();
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const [filter, setFilter] = useState("");
  const { isAuthenticated } = useUserStore();
  const [first, setFirst] = useState(true);
  const toast = useToast();
  const debouncedQuery = useDebounce(searchText, 2000);

  const modifyFeed = async (resp: any) => {
    await Promise.all(
      resp.agents.map(async (data: any, idx: number) => {
        const tmp = await pumpFunSdk.getBondingCurveAccount(
          new PublicKey(data.mint_public_key)
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
      })
    );
  };
  const fetchFeed = async (filter: string) => {
    try {
      setFeedLoading(true);
      let resp;
      if (searchText !== "") {
        const searchRes = await homeApiClient.searchFeed(searchText);
        if (searchRes.agents.length > 0) {
          resp = searchRes;
        } else {
          toast({
            title: `No results found for the search query!`,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom-right",
          });
          return;
        }
      } else {
        resp = await homeApiClient.feed(filter);
      }

      const sortedAgents = [...resp.agents].sort(
        (a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap)
      );
      if (first) {
        setOverlord(sortedAgents[0]);
        setFirst(false);
      }
      const { agents } = resp;
      const agentsWithHolders = await Promise.all(
        agents.map(async (agent) => {
          const holder = await getTokenHolders(agent.mint_public_key);
          return { ...agent, holder };
        })
      );

      setFeed(agentsWithHolders);

      // setFeed(resp.agents);
    } catch (err) {
      console.log(err);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(filter);
  }, [filter, debouncedQuery]);

  return (
    <Container>
      <Stack justifyContent="center" alignItems="center" px="20px">
        <Stack
          justifyContent="center"
          alignItems="center"
          marginBottom="20px"
          gap="40px"
        >
          <TimerScreen />
          {overlord && <MainCard {...overlord} />}
          <HStack
            width="100%"
            alignItems={{ base: "flex-start", lg: "center" }}
            flexDirection={{ base: "column", lg: "row" }}
            bg="linear-gradient(100deg, #571F0D -0.99%, #5E220F 64.54%, #642410 112.46%)"
            display="flex"
            justifyContent="space-between"
            marginTop={!overlord || feed.length === 0 ? "0px" : "0"}
            overflow="hidden"
            maxHeight={{ base: "auto", lg: "80px" }}
          >
            <Text
              fontSize="24px"
              className="knf"
              textTransform="uppercase"
              margin={{ base: "20px 20px 0 20px", lg: "20px" }}
            >
              Your agent can make it rain.
            </Text>
            <Box
              flexGrow="1"
              display={{ base: "none", lg: "block" }}
              overflow="hidden"
            >
              <Box width="100%" height="100%" mr="auto" right="0" top="0">
                <HomeSticker />
                {/* <HomeStickerBack /> */}
              </Box>
            </Box>
            <Button
              _hover={{
                opacity: 0.8,
              }}
              opacity={isAuthenticated ? 1 : 0.8}
              disabled={!isAuthenticated}
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
            <CoinsTable
              feed={feed}
              setFeed={setFeed}
              setFeedLoading={setFeedLoading}
              filter={filter}
              setFilter={setFilter}
            />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default HomeModule;
