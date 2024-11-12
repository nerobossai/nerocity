import { Box, Button, SimpleGrid, Spinner, Stack } from "@chakra-ui/react";
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

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DummyData = [
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
  {
    image: "https://bit.ly/dan-abramov",
    coinAddress: "martian12345",
    createdBy: "123456",
    marketCap: "32k",
    createdAt: 1730708878676,
    replies: "10",
    name: "Based frog",
    ticker: "$TYBF",
    description:
      "Based AI named steve playing minecraft woith his friends, wearing a chigi champs, with l rosellini lips, looking to spit out l ron hubbard but missing the scientology as he foes about his everyday boring",
  },
];

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
        <Button
          colorScheme="green"
          _hover={{
            opacity: 0.8,
          }}
          marginTop="20px"
          onClick={() => navigator.push(Paths.createAgent)}
        >
          Launch your AI agent coin
        </Button>
        {overlord && <OverlordModule overlord={overlord} />}
        <SearchModule />
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
          <Stack
            marginTop="2rem"
            fontSize={{ base: "16px", sm: "12px" }}
            alignItems="flex-start"
            padding="1rem"
          >
            <Button
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              colorScheme="blue"
              _hover={{
                opacity: 0.8,
              }}
              maxW={{ md: "200px", lg: "250px" }}
              margin={{ base: "0px", md: "20px" }}
            >
              sort: created at
            </Button>
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 3 }}
              spacing={10}
              padding={0}
              marginBottom={{ base: "40px", md: "40px" }}
              marginLeft={{ base: "0", md: "20px" }}
            >
              {feed.map((data: any) => {
                return parseFloat(data.market_cap) > 0 ? (
                  <Card {...data} key={data.id} />
                ) : null;
              })}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default HomeModule;
