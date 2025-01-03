import {
  Box,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { LiaTelegram } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";
import styled from "styled-components";

import SocialModalComponent from "@/components/SocialModal";
import SubscriptText from "@/components/SubscriptText";
import { pumpFunSdk } from "@/services/pumpfun";
import { getUserTokens } from "@/utils/getUserToken";

import { homeApiClient } from "../Home/services/homeApiClient";
import { profileApiClient } from "./services/profileApiClient";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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
  const [agentsCreated, setAgentsCreated] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState<number | string>("");
  const [coinsHeldData, setCoinsHeldData] = useState<CoinsHeldData[]>([]);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<any>();
  const [selectedSocialName, setSelectedSocialName] = useState<string>("");

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      let isCoinsHeldFetched = false;
      let isAgentsCreatedFetched = false;

      try {
        setLoading(true);

        // Fetch profile
        const profileData = await profileApiClient.fetchProfileByUserName(
          username as string,
        );
        const fetchedProfile = profileData.user;
        setProfile(fetchedProfile);

        // Fetch Agents Created Data
        const coinDataResponse = await profileApiClient.fetchCoinsByPublicKey(
          fetchedProfile.public_key as string,
        );
        const solPrice = (await homeApiClient.solPrice()).solana.usd;

        const agentsPromises = coinDataResponse.agents.map(
          async (agent: any) => {
            const tmp = await pumpFunSdk.getBondingCurveAccount(
              new PublicKey(agent.mint_public_key),
            );
            if (!tmp || tmp.complete) return null;

            const price =
              (((await tmp.getSellPrice(1, 0)) || 0) / 100) * solPrice;
            const marketcap =
              ((tmp.getMarketCapSOL() || 0) / LAMPORTS_PER_SOL) * solPrice;

            return {
              ...agent,
              price: price.toExponential(1),
              marketcap: marketcap.toFixed(3),
            };
          },
        );

        const agentsCreated = (await Promise.all(agentsPromises)).filter(
          Boolean,
        );
        setAgentsCreated(agentsCreated);

        if (!isCoinsHeldFetched) {
          setSelectedTab(1);
          setLoading(false);
          isAgentsCreatedFetched = true;
        }

        // Fetch Coins Held Data
        const tokensData = await getUserTokens(
          fetchedProfile.public_key as string,
        );
        const coinsHeldPromises = tokensData.map(async (data) => {
          try {
            const coinInfo = await profileApiClient.fetchCoinsCreatedByAgent(
              data.mint,
            );
            return coinInfo ? { ...data, ...coinInfo } : null;
          } catch {
            return null;
          }
        });
        const coinsHeld = (await Promise.all(coinsHeldPromises)).filter(
          Boolean,
        ) as CoinsHeldData[];
        setCoinsHeldData(coinsHeld);

        if (!isAgentsCreatedFetched) {
          setSelectedTab(0);
          setLoading(false);
          isCoinsHeldFetched = true;
        }

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
      <HStack
        width="100%"
        px={{ base: "0", md: "10%" }}
        alignItems="center"
        py="1rem"
        maxWidth="1200px"
        margin="auto"
        mb="20px"
      >
        <Box
          width="100%"
          gap="20px"
          height="100%"
          padding="4px 9px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          className="knf"
        >
          <Text fontSize="18px" cursor="pointer">
            <Link href="/app">
              <span style={{ color: "#959595" }}>HOME / </span>
            </Link>{" "}
            PROFILE
          </Text>
        </Box>
      </HStack>
      <Stack
        width="100%"
        px={{ base: "0", md: "15%" }}
        alignItems="flex-start"
        py="1rem"
        maxWidth="1200px"
        margin="auto"
        mb="20px"
      >
        <HStack alignItems="center" gap="10px">
          <Image boxSize="64px" src={profile?.profile_pic} />
          <Text fontSize="32px">{profile?.username ?? ""}</Text>
        </HStack>
        <VStack width="100%">
          <Tabs
            index={selectedTab}
            onChange={setSelectedTab}
            variant="unstyled"
            width="100%"
          >
            <TabList width="100%" pt="10px" mt="10px">
              <Tab
                _selected={{
                  color: "white",
                  borderBottom: "2px solid",
                  borderColor: "blue.500",
                }}
                color={selectedTab === 0 ? "white" : "#4A4A55"}
                borderBottom="2px solid"
                borderColor={selectedTab === 0 ? "blue.500" : "transparent"}
                display="flex"
                alignItems="center"
                gap="5px"
              >
                <span>COINS HELD</span>{" "}
              </Tab>
              <Tab
                _selected={{
                  color: "white",
                  borderBottom: "2px solid",
                  borderColor: "blue.500",
                }}
                color={selectedTab === 1 ? "white" : "#4A4A55"}
                borderBottom="2px solid"
                borderColor={selectedTab === 1 ? "blue.500" : "transparent"}
              >
                AGENTS CREATED
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel />
              <TabPanel />
            </TabPanels>
          </Tabs>
          {loading ? (
            <Spinner marginTop={20} />
          ) : (selectedTab === 0 && coinsHeldData.length === 0) ||
            (selectedTab === 1 && agentsCreated.length === 0) ? (
            <VStack alignItems="center" pt="50px" justifyContent="center">
              <Text>
                {selectedTab === 0 ? "No Coins Held!" : "No Agents Created!"}
              </Text>
            </VStack>
          ) : (
            <VStack bg="#1B1B1E" width="100%" overflowX="auto">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 20px",
                  padding: "0 20px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        color: "#656565",
                        textAlign: "left",
                        padding: "1rem",
                      }}
                    >
                      Name
                    </th>
                    {selectedTab === 0 ? (
                      <>
                        <th
                          style={{
                            color: "#656565",
                            textAlign: "left",
                            padding: "1rem",
                          }}
                        >
                          Coins
                        </th>
                        <th
                          style={{
                            color: "#656565",
                            textAlign: "left",
                            padding: "1rem",
                          }}
                        >
                          Value
                        </th>
                      </>
                    ) : (
                      <>
                        <th
                          style={{
                            color: "#656565",
                            textAlign: "left",
                            padding: "1rem",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            color: "#656565",
                            padding: "1rem",
                            textAlign: "left",
                          }}
                        >
                          Market Cap
                        </th>
                        {selectedTab === 1 && (
                          <th
                            style={{
                              color: "#656565",
                              padding: "1rem",
                              textAlign: "left",
                            }}
                          >
                            Social
                          </th>
                        )}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedTab === 0
                    ? coinsHeldData.map((coin, id) => (
                        <tr
                          key={id}
                          // @ts-ignore
                          style={{
                            backgroundColor:
                              isHovered === id ? "#2D2D2D" : "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => router.push(`/${id}`)}
                          onMouseEnter={() => setIsHovered(id)}
                          onMouseLeave={() => setIsHovered("")}
                        >
                          <td
                            style={{
                              height: "80px",
                              padding: "1rem",
                              borderLeft: "1px solid #343434",
                              borderTop: "1px solid #343434",
                              borderBottom: "1px solid #343434",
                            }}
                          >
                            {coin.name}
                          </td>
                          <td
                            style={{
                              padding: "1rem",
                              borderTop: "1px solid #343434",
                              borderBottom: "1px solid #343434",
                            }}
                          >
                            {coin.ticker}
                          </td>
                          <td
                            style={{
                              padding: "1rem",
                              borderTop: "1px solid #343434",
                              borderBottom: "1px solid #343434",
                              borderRight: "1px solid #343434",
                            }}
                          >
                            {coin.balance}
                          </td>
                        </tr>
                      ))
                    : agentsCreated.map((coin, id) => (
                        <tr
                          key={coin.ticker}
                          // @ts-ignore
                          style={{
                            backgroundColor:
                              isHovered === coin.ticker
                                ? "#2D2D2D"
                                : "transparent",
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => setIsHovered(coin.ticker)}
                          onMouseLeave={() => setIsHovered("")}
                        >
                          <td
                            onClick={() =>
                              router.push(`/${coin.mint_public_key}`)
                            }
                            style={{
                              height: "80px",
                              padding: "0.5rem 1rem",
                              borderLeft: "1px solid #343434",
                              borderTop: "1px solid #343434",
                              borderBottom: "1px solid #343434",
                            }}
                          >
                            {coin.name}
                          </td>
                          <td
                            onClick={() =>
                              router.push(`/${coin.mint_public_key}`)
                            }
                            style={{
                              padding: "0.5rem 1rem",
                              borderTop: "1px solid #343434",
                              borderBottom: "1px solid #343434",
                            }}
                          >
                            {coin.price ? (
                              <SubscriptText value={coin.price} />
                            ) : (
                              "--"
                            )}
                          </td>
                          <td
                            onClick={() =>
                              router.push(`/${coin.mint_public_key}`)
                            }
                            style={{
                              padding: "0.5rem 1rem",
                              borderTop: "1px solid #343434",
                              borderBottom: "1px solid #343434",
                              borderRight: "1px solid #343434",
                            }}
                          >
                            ${coin.market_cap}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem 1rem",
                              borderTop: "1px solid #343434",
                              borderBottom: "1px solid #343434",
                              borderRight: "1px solid #343434",
                            }}
                          >
                            <HStack>
                              <Icon
                                as={RiTwitterXFill}
                                size="1.2rem"
                                _hover={{ opacity: "0.8" }}
                                onClick={() => {
                                  setSelectedSocial(coin);
                                  setShowSocialModal(true);
                                  setSelectedSocialName("twitter");
                                }}
                              />
                              <Icon
                                as={LiaTelegram}
                                size="1.5rem"
                                _hover={{ opacity: "0.8" }}
                                onClick={() => {
                                  setSelectedSocial(coin);
                                  setShowSocialModal(true);
                                  setSelectedSocialName("telegram");
                                }}
                              />
                              <Icon
                                as={AiOutlineGlobal}
                                size="1.5rem"
                                _hover={{ opacity: "0.8" }}
                                onClick={() => {
                                  setSelectedSocial(coin);
                                  setShowSocialModal(true);
                                  setSelectedSocialName("website");
                                }}
                              />
                            </HStack>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </VStack>
          )}
        </VStack>
      </Stack>
      <SocialModalComponent
        isOpen={showSocialModal}
        onClose={() => {
          setSelectedSocial(undefined);
          setShowSocialModal(false);
          setSelectedSocialName("");
        }}
        setSelectedSocial={setSelectedSocial}
        data={selectedSocial}
        name={selectedSocialName}
      />
    </Container>
  );
}

export default ProfileModule;
