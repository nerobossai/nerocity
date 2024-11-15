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

import SubscriptText from "@/components/SubscriptText";
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

const RAYDIUM_MIGRATION_COMPLETED = "raydium_migration_completed";
interface CoinsHeldData {
  mint: string;
  balance: number;
  name: string;
  ticker: string;
}

function ProfileModule() {
  const router = useRouter();
  const { username } = router.query;

  const [selectedTab, setSelectedTab] = useState(0);
  const [coinsData, setCoinsData] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coinsHeldData, setCoinsHeldData] = useState<CoinsHeldData[]>([]);

  useEffect(() => {
    if (!username) {
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await profileApiClient.fetchProfileByUserName(
          username as string,
        );
        const fetchedProfile = profileData.user;
        setProfile(fetchedProfile);

        const tokensData: any[] = await getUserTokens(
          profileData.user.public_key as string,
        );

        const dataWithNameTicker = [];
        for (let i = 0; i < tokensData.length; i++) {
          const data = tokensData[i];
          try {
            const coinsHeldResponse =
              await profileApiClient.fetchCoinsCreatedByAgent(data.mint);
            if (coinsHeldResponse) {
              dataWithNameTicker.push({
                ...data,
                name: coinsHeldResponse.name,
                ticker: coinsHeldResponse.ticker,
              });
            }
          } catch {
            continue;
          }
        }

        setCoinsHeldData(dataWithNameTicker);

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
            if (tmp.complete) {
              return RAYDIUM_MIGRATION_COMPLETED;
            }

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
          {loading ? (
            <Spinner marginTop={20} />
          ) : (
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
                {selectedTab === 0
                  ? coinsHeldData.map((coin, index) => (
                      <Tr key={index}>
                        <>
                          <Td>{coin.name}</Td>
                          <Td>{coin.ticker}</Td>
                          <Td>{coin.balance}</Td>
                        </>
                      </Tr>
                    ))
                  : coinsData.map((coin) => (
                      <Tr key={coin.id}>
                        <Td>{coin.name}</Td>
                        <Td>
                          <SubscriptText value={coin.price} />
                        </Td>
                        <Td>{coin.market_cap}</Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          )}
        </VStack>
      </Stack>
    </Container>
  );
}

export default ProfileModule;
