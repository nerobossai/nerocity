import { HStack, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

export type CardProps = {
  image: string;
  createdBy: string;
  marketCap: string;
  replies: string;
  name: string;
  ticker: string;
  createdAt: number | string;
  onClick: Function;
};

const Container = styled.div``;

function Card(props: CardProps) {
  return (
    <Container>
      <HStack>
        <Image src={props.image} alt="ai agent image" />
        <Stack>
          <Text>Created by @{props.createdBy}</Text>
          <Text>Market Cap ${props.marketCap}</Text>
          <Text>Replies {props.replies}</Text>
          <Text>
            {props.name} {props.ticker}
          </Text>
        </Stack>
      </HStack>
    </Container>
  );
}

export default Card;
