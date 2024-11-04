import { Button, SimpleGrid, Stack } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

import Card from "@/components/Card";

import OverlordModule from "./overlord";
import SearchModule from "./search";

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
  return (
    <Container>
      <Stack justifyContent="center" alignItems="center">
        <Button
          colorScheme="green"
          _hover={{
            opacity: 0.8,
          }}
        >
          Launch your AI agent coin
        </Button>
        <OverlordModule />
        <SearchModule />
        <Stack marginTop="2rem">
          <Button
            marginLeft="1rem"
            maxWidth="15vw"
            colorScheme="blue"
            _hover={{
              opacity: 0.8,
            }}
          >
            sort: by market cap
          </Button>
          <SimpleGrid columns={3} spacing={10}>
            {DummyData.map((data, idx) => {
              return (
                <Card
                  {...data}
                  key={idx}
                  onClick={() => alert(`Clicked ${idx}`)}
                />
              );
            })}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  );
}

export default HomeModule;
