import { HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { timeDifference } from "@/utils/timeDifference";

export type CardProps = {
  image: string;
  createdBy: string;
  marketCap: string;
  replies: string;
  name: string;
  ticker: string;
  createdAt: number | string;
  coinAddress: string;
  description?: string;
  onClick?: any;
};

const Container = styled.div`
  .card-main {
    transition: background-color 50ms;
    padding: 1rem;
  }
  .card-main:hover {
    background-color: #211e1e;
  }
`;

function Card(props: CardProps) {
  const navigator = useRouter();
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    } else {
      navigator.push(props.coinAddress);
    }
  };
  return (
    <Container onClick={handleClick}>
      <HStack
        className="card-main"
        justifyContent="start"
        alignItems="start"
        spacing="1rem"
      >
        <Image
          boxSize="8rem"
          objectFit="cover"
          src={props.image}
          alt="ai agent image"
        />
        <Stack>
          <HStack justifyContent="space-between" minWidth="17rem">
            <Text fontSize="12px">Created by @{props.createdBy}</Text>
            <Text fontWeight="bold" color="blue.100" fontSize="12px">
              {timeDifference(
                Date.now(),
                parseInt(props.createdAt.toString(), 10),
              )}
            </Text>
          </HStack>
          <Text fontSize="12px" fontWeight="bold" color="green.50">
            Market Cap ${props.marketCap}
          </Text>
          <Text fontSize="12px">Replies {props.replies}</Text>
          <Text fontWeight="bold" fontSize="20px">
            {props.name} {props.ticker}
          </Text>
          {props.description && (
            <Text maxWidth="20rem">{props.description || ""}</Text>
          )}
        </Stack>
      </HStack>
    </Container>
  );
}

export default Card;
