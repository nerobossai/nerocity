import {
  Avatar,
  Box,
  HStack,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { pumpFunSdk } from "@/services/pumpfun";
import { getUserTokens } from "@/utils/getUserToken";

import { homeApiClient } from "../Home/services/homeApiClient";
import { profileApiClient } from "./services/profileApiClient";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
`;

const samepleData = [
  {
    user_details: {
      new_user: true,
    },
    id: "5JijRF9hXonAgG3XSctHgM5Ar44fStZuPT9D7XEoJGBY",
    name: "marvin",
    market_cap: "6510.000",
    created_at: "1731330879893",
    replies: "4",
    ticker: "MARVIN",
    description:
      "marvin is the first martian in the form of pepe, he is a slick trader liquidiating all idiots who try to short squeeze him. he has a vicious tongue and doesn't stop himself from criticizing people who he talks to and shows them down.",
    image:
      "https://ipfs.io/ipfs/QmcHSnavawPKpNoQsaEGkSu5Zm2bSP5zTneDTUsJPQjd1w",
    token_metadata: {
      name: "marvin",
      symbol: "MARVIN",
      description:
        "marvin is the first martian in the form of pepe, he is a slick trader liquidiating all idiots who try to short squeeze him. he has a vicious tongue and doesn't stop himself from criticizing people who he talks to and shows them down.",
      image:
        "https://ipfs.io/ipfs/QmcHSnavawPKpNoQsaEGkSu5Zm2bSP5zTneDTUsJPQjd1w",
      show_name: true,
      created_on: "https://pump.fun",
    },
    mint_public_key: "5JijRF9hXonAgG3XSctHgM5Ar44fStZuPT9D7XEoJGBY",
    fee_basis_points: 100,
    initial_virtual_sol_reserves: 30000000000,
    initial_virtual_token_reserves: 793100000000000,
    current_virtual_sol_reserves: 30000000000,
    target_pool_balance: 150000000000,
    current_virtual_token_reserves: 793100000000000,
  },
];

function ProfileModule() {
  const router = useRouter();
  const { username } = router.query;

  const [selectedTab, setSelectedTab] = useState(0);
  const [coinsData, setCoinsData] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    if (!username) {
      return;
    }
    const fetchData = async () => {
      try {
        const profileData = await profileApiClient.fetchProfileByUserName(
          username as string,
        );
        const fetchedProfile = profileData.user;
        setProfile(fetchedProfile);
        const coinDataResponse = await profileApiClient.fetchCoinsByPublicKey(
          fetchedProfile.public_key as string,
        );
        const coinData = coinDataResponse.agents;
        // const coinData = samepleData;
        const solPrice = await homeApiClient.solPrice();

        const updatedCoinData = await Promise.all(
          coinData.map(async (coin: any) => {
            const tmp = await pumpFunSdk.getBondingCurveAccount(
              new PublicKey(coin.mint_public_key),
            );

            if (!tmp) return coin;

            const price =
              (((await tmp.getSellPrice(1, 0)) || 0) / 100) *
              solPrice.solana.usd;

            const priceExponential = price.toExponential(1).toString();
            const marketcap = (
              ((tmp.getMarketCapSOL() || 0) / LAMPORTS_PER_SOL) *
              solPrice.solana.usd
            )
              .toFixed(3)
              .toString();

            return {
              ...coin,
              price: priceExponential,
              marketcap,
            };
          }),
        );

        const tokensData = await getUserTokens(
          profileData.user.public_key as string,
        );
        setCoinsData(updatedCoinData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("User not found!");
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (!username) {
    return null;
  }

  if (!profile) {
    return (
      <Box className="flex h-[80vh] w-screen items-center justify-center">
        {loading ? <Spinner /> : error}
      </Box>
    );
  }

  return (
    <Container>
      <Stack padding="2rem" borderRadius="1rem" gap="20px">
        <VStack alignItems="center" gap="10px">
          <Avatar boxSize="30px" src={profile?.profile_pic} />
          <p className="text-sm">Username: @{profile?.username ?? ""}</p>
        </VStack>
        <VStack>
          <HStack borderBottom="2px solid grey" padding="1rem">
            <Box
              padding="1rem 2rem"
              fontSize="12px"
              cursor="pointer"
              borderRadius="10px"
              backgroundColor={selectedTab === 0 ? "grey.100" : ""}
              onClick={() => setSelectedTab(0)}
            >
              Coins Held
            </Box>
            <Box
              padding="1rem 2rem"
              fontSize="12px"
              cursor="pointer"
              borderRadius="10px"
              backgroundColor={selectedTab === 1 ? "grey.100" : ""}
              onClick={() => setSelectedTab(1)}
            >
              Coins created
            </Box>
          </HStack>
          <Table variant="unstyled">
            <Thead>
              <Tr>
                <Th>Name</Th>
                {selectedTab === 0 ? (
                  <>
                    <Th>Coins</Th>
                    <Th>Value</Th>
                  </>
                ) : (
                  <>
                    <Th>Price</Th>
                    <Th>Market Cap</Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {coinsData.map((coin) => (
                <Tr key={coin.id}>
                  <Td>{coin.name}</Td>
                  {selectedTab === 0 ? (
                    <>
                      <Td>{coin.coinsHeld}</Td>
                      <Td>{coin.value}</Td>
                    </>
                  ) : (
                    <>
                      <Td>{coin.price}</Td>
                      <Td>{coin.market_cap}</Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Stack>
    </Container>
  );
}

export default ProfileModule;
