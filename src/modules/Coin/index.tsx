import { HStack, Spinner, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Paths } from "@/constants/paths";

import type { AgentResponse } from "../Home/services/homeApiClient";
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

  const fetchAgent = async () => {
    try {
      if (!router.query?.coin) return;
      setLoading(true);
      const resp = await coinApiClient.getAgent(router.query.coin as string);
      console.log(resp);
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

  useEffect(() => {
    fetchAgent();
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
          <TradeModule {...DummyPriceData} />

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
