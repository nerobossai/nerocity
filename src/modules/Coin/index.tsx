import { HStack, Spinner, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Paths } from "@/constants/paths";

import {
  type AgentResponse,
  homeApiClient,
} from "../Home/services/homeApiClient";
import AboutModule from "./about";
import ChatModule from "./chats";
import CoinHeaderModule from "./coinheader";
import GraphModule from "./graph";
import ProgressModule from "./progress";
import { coinApiClient } from "./services/coinApiClient";
import TradeModule from "./trade";

const Container = styled.div`
  padding: 2rem;
  padding-top: 0rem;
`;

const DummyPriceData = {
  currentPrice: ".00007",
  holders: 67,
  trades: [],
};

function CoinModule() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agentDetails, setAgentDetails] = useState<AgentResponse>();
  const [price, setPrice] = useState<string>();

  const fetchAgent = async () => {
    try {
      if (!router.query?.coin) return;
      setLoading(true);
      const resp = await coinApiClient.getAgent(router.query.coin as string);
      if (!resp?.id) {
        return await router.replace(Paths.home);
      }
      setAgentDetails(resp);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (timeout: number) => {
    if (!router?.query?.coin) return;
    return setTimeout(async () => {
      try {
        const resp = await coinApiClient.getAgent(router.query.coin as string);
        if (!resp?.id) {
          return await router.replace(Paths.home);
        }
        const solPrice = await homeApiClient.solPrice();
        setAgentDetails(resp);
        const price =
          (resp.current_virtual_sol_reserves /
            resp.current_virtual_token_reserves) *
          solPrice.solana.usd;
        setPrice(price.toFixed(5).toString());
        startPolling(timeout);
      } catch (err) {
        console.error(err);
      }
    }, timeout);
  };

  useEffect(() => {
    fetchAgent();
    // @ts-ignore will fix this once this method is finished
    const poll = startPolling(500);
    return () => {
      clearTimeout(poll);
    };
  }, [router]);

  return (
    <Container>
      <HStack
        justifyContent="space-between"
        alignItems="start"
        flexDirection={["column-reverse", "row"]}
      >
        <Stack>
          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <CoinHeaderModule {...agentDetails} />
          ) : null}

          <GraphModule />
          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <ChatModule agentId={agentDetails.id} />
          ) : null}
        </Stack>
        <Stack maxWidth={["90vw", "33vw"]}>
          <TradeModule {...DummyPriceData} currentPrice={price || ""} />

          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <AboutModule {...agentDetails} />
          ) : null}
          <ProgressModule />
        </Stack>
      </HStack>
    </Container>
  );
}

export default CoinModule;
