import { HStack, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import AboutModule from "./about";
import ChatModule from "./chats";
import CoinHeaderModule from "./coinheader";
import GraphModule from "./graph";
import ProgressModule from "./progress";
import TradeModule from "./trade";

const Container = styled.div`
  padding: 2rem;
  padding-top: 0rem;
`;

const DummyData = {
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
};

const DummyPriceData = {
  currentPrice: ".00007",
  holders: 67,
  trades: [],
};

function CoinModule() {
  const router = useRouter();

  return (
    <Container>
      <HStack
        justifyContent="space-between"
        alignItems="start"
        flexDirection={["column-reverse", "row"]}
      >
        <Stack>
          <CoinHeaderModule {...DummyData} />
          <GraphModule />
          <ChatModule />
        </Stack>
        <Stack maxWidth={["90vw", "33vw"]}>
          <TradeModule {...DummyPriceData} />
          <AboutModule {...DummyData} />
          <ProgressModule />
        </Stack>
      </HStack>
    </Container>
  );
}

export default CoinModule;
