import { HStack, Spinner, Stack } from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
  const [realSolReserve, setRealSolReserve] = useState<number>();
  const [completionPercent, setCompletionPercent] = useState<number>(0);
  const [tokenHolders, setTokenHolders] = useState<string>("0");
  const [candlestickData, setCandlestickData] = useState<CandlestickResponse>();

  const startPolling = (timeout: number, agent?: AgentResponse) => {
    if (!router?.query?.coin) return;
    return setTimeout(async () => {
      try {
        let ag: AgentResponse;

        if (!agent) {
          const resp = await coinApiClient.getAgent(
            router.query.coin as string,
          );
          if (!resp?.id) {
            return await router.replace(Paths.home);
          }
          getTokenHolders(resp.mint_public_key).then((data) => {
            setTokenHolders(data);
          });
          ag = resp;
          setAgentDetails(ag);
        } else {
          ag = agent;
        }

        const tmp = await pumpFunSdk.getBondingCurveAccount(
          new PublicKey(ag.mint_public_key),
        );

        if (!tmp) {
          return;
        }

        const solPrice = await homeApiClient.solPrice();
        const price =
          (((await tmp?.getSellPrice(1, 0)) || 0) / 100) * solPrice.solana.usd;

        const marketcap = (
          ((tmp?.getMarketCapSOL() || 0) / LAMPORTS_PER_SOL) *
          solPrice.solana.usd
        )
          .toFixed(3)
          .toString();

        setMarketCap(marketcap);
        setPrice(price.toExponential(1).toString());
        setCompletionPercent(
          (((tmp.initialTokenReserve - tmp.realTokenReserves) * 10 ** 6) /
            tmp.initialTokenReserve) *
            100,
        );
        setRealTokenReserve(
          parseInt(((tmp?.realTokenReserves || 0) / 10 ** 6).toString(10), 10),
        );
        setRealSolReserve(
          Math.floor((tmp?.realSolReserves || 0) / LAMPORTS_PER_SOL),
        );

        const prices = await homeApiClient.candlestickData(ag.mint_public_key);
        setCandlestickData(prices);
        startPolling(timeout, ag);
      } catch (err) {
        console.error(err);
      }
    }, timeout);
  };

  useEffect(() => {
    // @ts-ignore will fix this once this method is finished
    const poll = startPolling(1000);
    return () => {
      clearTimeout(poll);
    };
  }, [router]);

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
            <AboutModule
              {...agentDetails}
              current_real_token_reserves={realTokenReserve}
              current_virtual_sol_reserves={realSolReserve}
            />
          ) : null}
          <ProgressModule completionPercent={completionPercent} />
        </Stack>
      </HStack>
    </Container>
  );
}

export default CoinModule;
