import { HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { timeDifference } from "@/utils/timeDifference";

export type CardProps = {
  created_by: string;
  id: string;
  name: string;
  ticker: string;
  description?: string;
  market_cap: string;
  created_at: number;
  complete?: boolean;
  replies: string;
  image: string;
  fee_basis_points?: number;
  initial_real_token_reserves?: number;
  initial_virtual_sol_reserves?: number;
  initial_virtual_token_reserves?: number;
  token_total_supply?: number;
  current_real_token_reserves?: number;
  current_virtual_sol_reserves?: number;
  current_virtual_token_reserves?: number;
  current_token_total_supply?: number;
  onClick?: any;
  completionPercent?: number;
  twenty_four_hr_changes?: number;
  social?: {
    twitter: string;
    telegram: string;
    website?: string;
  };
};

const Container = styled.div`
  .card-main {
    transition: background-color 50ms;
    padding: 1rem;
    cursor: pointer;
    height: 100%;
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
      navigator.push(props.id);
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
        <Stack width="100%">
          <HStack justifyContent="space-between">
            <Text fontSize="12px">Created by @{props.created_by}</Text>
            <Text fontWeight="bold" color="blue.100" fontSize="12px">
              {timeDifference(
                Date.now(),
                parseInt(props.created_at.toString(), 10),
              )}
            </Text>
          </HStack>
          <Text fontSize="12px" fontWeight="bold" color="green.50">
            {props.complete === true
              ? "Raydium Pool Seeded"
              : `Market Cap $${props.market_cap}`}
          </Text>
          <Text fontSize="12px">Replies {props.replies}</Text>
          <Text fontWeight="bold" fontSize="20px">
            {props.name} ${props.ticker}
          </Text>
          {props.description && (
            <Text
              maxWidth="20rem"
              fontSize={{ base: "12px", sm: "14px", md: "16px" }}
            >
              {props.description || ""}
            </Text>
          )}
        </Stack>
      </HStack>
    </Container>
  );
}

export default Card;
