import {
  Box,
  HStack,
  Spinner,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import TabBar from "@/components/TabBar";
import { Paths } from "@/constants/paths";
import { pumpFunSdk } from "@/services/pumpfun";
import { getTokenHolders } from "@/utils/getTokenHolders";

import type {
  AgentResponse,
  CandlestickResponse,
} from "../Home/services/homeApiClient";
import { homeApiClient } from "../Home/services/homeApiClient";
import AboutModule from "./about";
import ChatModule from "./chats";
import CoinHeaderModule from "./coinheader";
import CandlestickChart from "./graph";
import ProgressModule from "./progress";
import { coinApiClient } from "./services/coinApiClient";
import TradeModule from "./trade";

const Container = styled.div`
  padding: 2rem;
  padding-top: 0rem;
`;

function CoinModule() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agentDetails, setAgentDetails] = useState<AgentResponse>();
  const [price, setPrice] = useState<string>();
  const [marketCap, setMarketCap] = useState<string>();
  const [realTokenReserve, setRealTokenReserve] = useState<number>();
  const [realSolReserve, setRealSolReserve] = useState<string>();
  const [completionPercent, setCompletionPercent] = useState<number>(0);
  const [tokenHolders, setTokenHolders] = useState<string>("0");
  const [candlestickData, setCandlestickData] = useState<CandlestickResponse>();
  const [selectedTab, setSelectedTab] = useState("Info");

  const isLargeScreen = useBreakpointValue({ base: false, md: true });

  const startPolling = (
    timeout: number,
    agent?: AgentResponse,
  ): NodeJS.Timeout | null => {
    if (!router?.query?.coin) return null;

    return setTimeout(async () => {
      try {
        const ag = await executePollingLogic(agent);
        startPolling(timeout, ag); // Continue polling with updated agent if necessary
      } catch (err) {
        console.error(err);
      }
    }, timeout);
  };

  const executePollingLogic = async (
    agent?: AgentResponse,
  ): Promise<AgentResponse | undefined> => {
    let ag: AgentResponse;

    if (!agent) {
      setLoading(true);
      const resp = await coinApiClient.getAgent(router.query.coin as string);
      if (!resp?.id) {
        await router.replace(Paths.home);
        return agent;
      }
      const data = await getTokenHolders(resp.mint_public_key);
      setTokenHolders(data);
      ag = resp;
      setAgentDetails(ag);
      setLoading(false);
    } else {
      ag = agent;
    }

    const tmp = await pumpFunSdk.getBondingCurveAccount(
      new PublicKey(ag.mint_public_key),
    );

    if (!tmp) return;

    const solPrice = await homeApiClient.solPrice();
    const price =
      (((await tmp.getSellPrice(1, 0)) || 0) / 100) * solPrice.solana.usd;

    const marketcap = (
      ((tmp.getMarketCapSOL() || 0) / LAMPORTS_PER_SOL) *
      solPrice.solana.usd
    )
      .toFixed(3)
      .toString();

    setMarketCap(marketcap);
    setPrice(price.toExponential(1).toString());
    setCompletionPercent(
      ((tmp.initialTokenReserve - tmp.realTokenReserves) /
        tmp.initialTokenReserve) *
        100,
    );
    setRealTokenReserve(
      parseInt(((tmp.realTokenReserves || 0) / 10 ** 6).toString(10), 10),
    );
    setRealSolReserve(
      ((tmp.realSolReserves || 0) / LAMPORTS_PER_SOL).toFixed(2),
    );

    const prices = await homeApiClient.candlestickData(ag.mint_public_key);
    setCandlestickData(prices);
    return ag;
  };

  useEffect(() => {
    // @ts-ignore will fix this once this method is finished
    const poll = startPolling(1000);
    return () => {
      if (poll) {
        clearTimeout(poll);
      }
    };
  }, [router]);

  if (loading) {
    return (
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Spinner />
      </Box>
    );
  }

  if (!isLargeScreen && agentDetails) {
    if (selectedTab === "Info") {
      return (
        <Box width="100%" display="flex" height="80vh" flexDirection="column">
          <CoinHeaderModule
            {...agentDetails}
            market_cap={marketCap || "0"}
            completionPercent={completionPercent}
          />
          <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </Box>
      );
    }
    if (selectedTab === "Charts") {
      return (
        <Box
          width="100%"
          display="flex"
          height="80vh"
          flexDirection="column"
          padding="1rem"
        >
          <CandlestickChart
            marginTop="0.5rem"
            fontSize="12px"
            data={candlestickData || []}
            symbol={agentDetails.ticker}
            priceData={{
              open: null,
              low: null,
              high: null,
              close: null,
            }}
          />
          <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </Box>
      );
    }
    if (selectedTab === "Buy/Sell") {
      return (
        <Box
          width="100%"
          display="flex"
          height="80vh"
          flexDirection="column"
          padding="1rem"
        >
          <Box flex="1" />
          <Box display="flex" flexDirection="column-reverse">
            <TradeModule
              currentPrice={price || "0"}
              tokenDetails={agentDetails}
              holders={tokenHolders}
            />
          </Box>
          <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </Box>
      );
    }
    if (selectedTab === "Comments") {
      return (
        <Box
          width="100%"
          display="flex"
          minHeight="80vh"
          flexDirection="column"
          padding="1rem"
          gap="20px"
        >
          <ChatModule agentId={agentDetails.id} />
          <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </Box>
      );
    }
  }

  return (
    <Container>
      <HStack
        justifyContent="space-evenly"
        alignItems="start"
        flexDirection={["column-reverse", "row"]}
      >
        <Stack>
          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <>
              <CoinHeaderModule
                {...agentDetails}
                market_cap={marketCap || "0"}
                completionPercent={completionPercent}
              />
              <CandlestickChart
                marginTop="0.5rem"
                fontSize="12px"
                data={candlestickData || []}
                symbol={agentDetails.ticker}
                priceData={{
                  open: null,
                  low: null,
                  high: null,
                  close: null,
                }}
              />
            </>
          ) : null}
          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <ChatModule agentId={agentDetails.id} />
          ) : null}
        </Stack>
        <Stack maxWidth={["90vw", "33vw"]}>
          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <TradeModule
              currentPrice={price || "0"}
              tokenDetails={agentDetails}
              holders={tokenHolders}
            />
          ) : null}

          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <>
              <AboutModule
                {...agentDetails}
                current_real_token_reserves={realTokenReserve}
                sol_reserve={realSolReserve}
              />
              <ProgressModule completionPercent={completionPercent} />
            </>
          ) : null}
        </Stack>
      </HStack>
    </Container>
  );
}

export default CoinModule;
