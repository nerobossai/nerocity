import { Button, SimpleGrid, Spinner, Stack } from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Card from "@/components/Card";
import { Paths } from "@/constants/paths";
import { pumpFunSdk } from "@/services/pumpfun";

import SearchModule from "./search";
import { homeApiClient } from "./services/homeApiClient";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
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
          onClick={() => navigator.push(Paths.createAgent)}
        >
          Launch your AI agent coin
        </Button>
        {/* <OverlordModule /> */}
        <SearchModule />
        {feedLoading ? (
          <Spinner />
        ) : (
          <Stack marginTop="2rem">
            <Button
              marginLeft="1rem"
              maxWidth="15vw"
              colorScheme="blue"
              _hover={{
                opacity: 0.8,
              }}
            >
              sort: created at
            </Button>
            <SimpleGrid columns={3} spacing={10}>
              {feed.map((data: any) => {
                return <Card {...data} key={data.id} />;
              })}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default HomeModule;
