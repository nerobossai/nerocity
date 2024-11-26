import {
  Box,
  HStack,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import TabBar from "@/components/TabBar";
import MemoizedChart from "@/components/TVChartContainer";
import { Paths } from "@/constants/paths";
import { pumpFunSdk } from "@/services/pumpfun";
import { getTokenHolders } from "@/utils/getTokenHolders";
import { logger } from "@/utils/Logger";

import type {
  AgentResponse,
  CandlestickResponse,
} from "../Home/services/homeApiClient";
import { homeApiClient } from "../Home/services/homeApiClient";
import AboutModule from "./about";
import ActivityBar from "./activityBar";
import CoinHeaderModule from "./coinheader";
import type { PumpfunCoinResponse } from "./services/coinApiClient";
import { coinApiClient } from "./services/coinApiClient";
import TradeModule from "./trade";

const Container = styled.div`
  padding: 2rem;
  padding-top: 0rem;
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto;
`;

const RAYDIUM_MIGRATION_COMPLETED = "raydium_migration_completed";

interface BreadcrumbProps {
  loading: boolean;
  currentPage?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ loading, currentPage }) => {
  const router = useRouter();

  return (
    <HStack width="100%" alignItems="center" p="20px" mt="12px">
      {!loading && (
        <Box
          display="flex"
          alignItems="center"
          gap="20px"
          cursor="pointer"
          onClick={() => router.push("/")}
          className="knf"
        >
          <Text fontSize="18px" cursor="pointer">
            <span style={{ color: "#959595" }} onClick={() => router.push("/")}>
              HOME /
            </span>{" "}
            {/* {currentPage.toUpperCase()} */}
            TICKER
          </Text>
        </Box>
      )}
    </HStack>
  );
};

function CoinModule() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agentDetails, setAgentDetails] = useState<AgentResponse>();
  const [price, setPrice] = useState<string>();
  const [marketCap, setMarketCap] = useState<string>();
  const [realTokenReserve, setRealTokenReserve] = useState<number>();
  const [realSolReserve, setRealSolReserve] = useState<string>();
  const [completionPercent, setCompletionPercent] = useState<number>(0);
  const [tokenHolders, setTokenHolders] = useState<string>("0");
  const [candlestickData, setCandlestickData] = useState<CandlestickResponse>();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [pumpfunData, setPumpfunData] = useState<PumpfunCoinResponse>();

  const isLargeScreen = useBreakpointValue({ base: false, md: true });

  const fetchPumpfunData = async () => {
    try {
      const resp = await coinApiClient.fetchPumpfunData(
        router.query.coin as string,
      );
      setMarketCap(resp.usd_market_cap.toFixed(3));

      const raydiumData = await coinApiClient.fetchPoolPrice(resp.raydium_pool);
      const price = parseFloat(
        raydiumData?.attributes?.base_token_price_usd || "0",
      ).toExponential();
      setPrice(price);
      setCompletionPercent(100);
      setPumpfunData(resp);
    } catch (err) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (
    timeout: number,
    agent?: AgentResponse,
  ): NodeJS.Timeout | null => {
    if (!router?.query?.coin) return null;

    return setTimeout(async () => {
      try {
        const ag = await executePollingLogic(agent);
        if (!ag) return;
        if (ag === RAYDIUM_MIGRATION_COMPLETED) {
          fetchPumpfunData();
          return;
        }
        startPolling(timeout, ag); // Continue polling with updated agent if necessary
      } catch (err) {
        console.error(err);
      }
    }, timeout);
  };

  const executePollingLogic = async (
    agent?: AgentResponse,
  ): Promise<
    AgentResponse | typeof RAYDIUM_MIGRATION_COMPLETED | undefined
  > => {
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

    if (!tmp) {
      await router.replace(Paths.home);
      return;
    }
    if (tmp.complete) {
      return RAYDIUM_MIGRATION_COMPLETED;
    }

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
    if (selectedTab === 0) {
      return (
        <>
          <Box
            width="100%"
            display="flex"
            height="80vh"
            flexDirection="column"
            padding="1rem"
          >
            <Breadcrumb loading={loading} />
            <HStack width="100%" alignItems="center" p="20px" />
            <Box
              display="flex"
              flexDirection="column"
              w="full"
              mr="auto"
              flexGrow={1}
              gap={8}
            >
              <Stack padding="0 1rem" bg="#1B1B1E" flexGrow="1" width="100%">
                {agentDetails ? (
                  <>
                    <CoinHeaderModule
                      {...agentDetails}
                      market_cap={marketCap || "0"}
                    />

                    {pumpfunData ? (
                      <iframe
                        height="400px"
                        width="100%"
                        id="geckoterminal-embed"
                        title="GeckoTerminal Embed"
                        src={`https://www.geckoterminal.com/solana/pools/${pumpfunData.raydium_pool}?embed=1&info=0&swaps=0`}
                        frameBorder="0"
                        allow="clipboard-write"
                        allowFullScreen
                      />
                    ) : (
                      <MemoizedChart
                        mintKey={agentDetails.mint_public_key}
                        symbol={agentDetails.ticker}
                      />
                    )}
                  </>
                ) : null}
              </Stack>
              <VStack width="100%" alignItems="flex-start" flexGrow={1}>
                <AboutModule
                  {...agentDetails}
                  current_real_token_reserves={realTokenReserve}
                  sol_reserve={realSolReserve}
                />
              </VStack>
            </Box>
          </Box>
          <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </>
      );
    }
    if (selectedTab === 1) {
      return (
        <>
          <Box
            width="100%"
            display="flex"
            height="80vh"
            flexDirection="column"
            padding="1rem"
          >
            <Breadcrumb loading={loading} />
            <Box display="flex" flexDirection="column-reverse">
              <TradeModule
                currentPrice={price || "0"}
                tokenDetails={agentDetails}
                holders={tokenHolders}
                pumpfunData={pumpfunData}
              />
            </Box>
          </Box>{" "}
          <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </>
      );
    }
    if (selectedTab === 2) {
      return (
        <>
          <Box
            width="100%"
            display="flex"
            minHeight="80vh"
            flexDirection="column"
            padding="1rem"
            gap="20px"
          >
            <Breadcrumb loading={loading} />
            <ActivityBar agentId={agentDetails.id} />
          </Box>{" "}
          <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </>
      );
    }
  }

  return (
    <Container>
      <Breadcrumb loading={loading} />
      <HStack
        justifyContent="space-evenly"
        alignItems="start"
        flexDirection={["column-reverse", "row"]}
        gap="2rem"
        width="100%"
        p="20px"
      >
        <VStack width="100%" maxWidth="800px">
          <Stack padding="0 1rem" bg="#1B1B1E" flexGrow="1" width="100%">
            {agentDetails ? (
              <>
                <CoinHeaderModule
                  {...agentDetails}
                  market_cap={marketCap || "0"}
                />

                {pumpfunData ? (
                  <iframe
                    height="400px"
                    width="100%"
                    id="geckoterminal-embed"
                    title="GeckoTerminal Embed"
                    src={`https://www.geckoterminal.com/solana/pools/${pumpfunData.raydium_pool}?embed=1&info=0&swaps=0`}
                    frameBorder="0"
                    allow="clipboard-write"
                    allowFullScreen
                  />
                ) : (
                  <MemoizedChart
                    mintKey={agentDetails.mint_public_key}
                    symbol={agentDetails.ticker}
                  />
                )}
              </>
            ) : null}
          </Stack>

          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <ActivityBar agentId={agentDetails.id} />
          ) : null}
        </VStack>
        <Box padding="0" alignItems="flex-start" maxWidth="320px">
          {loading ? (
            <Spinner />
          ) : agentDetails ? (
            <TradeModule
              currentPrice={price || "0"}
              tokenDetails={agentDetails}
              holders={tokenHolders}
              pumpfunData={pumpfunData}
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
              {/* <ProgressModule completionPercent={completionPercent} /> */}
            </>
          ) : null}
        </Box>
      </HStack>
    </Container>
  );
}

export default CoinModule;
