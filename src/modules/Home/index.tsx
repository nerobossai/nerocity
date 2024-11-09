import { Box, Button, SimpleGrid, Spinner, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Card from "@/components/Card";
import TabBar from "@/components/TabBar";
import { Paths } from "@/constants/paths";

import OverlordModule from "./overlord";
import SearchModule from "./search";
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

  const fetchFeed = async () => {
    try {
      setFeedLoading(true);
      const resp = await homeApiClient.feed();
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
        <Box className="hidden md:block">
          <Button
            colorScheme="green"
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => navigator.push(Paths.createAgent)}
          >
            Launch your AI agent coin
          </Button>
        </Box>
        <OverlordModule />
        <Box className="flex w-full justify-center py-4 md:hidden">
          <Button
            colorScheme="green"
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => navigator.push(Paths.createAgent)}
          >
            Launch your AI agent coin
          </Button>
        </Box>
        <SearchModule />
        {feedLoading ? (
          <Spinner />
        ) : (
          <Stack
            marginTop="2rem"
            fontSize={{ base: "16px", sm: "12px" }}
            alignItems={{ base: "flex-start", md: "center", padding: "1rem" }}
          >
            <Button
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              colorScheme="blue"
              _hover={{
                opacity: 0.8,
              }}
            >
              sort: created at
            </Button>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              margin={{ sm: "20px" }}
            >
              {DummyData.map((data: any) => {
                return <Card {...data} key={data.id} />;
              })}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
      <TabBar />
    </Container>
  );
}

export default HomeModule;
