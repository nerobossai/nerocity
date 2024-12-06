import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { FEES, pumpFunSdk } from "@/services/pumpfun";
import { getRaydiumLink } from "@/utils";
import { logger } from "@/utils/Logger";

import type {
  AgentResponse,
  SolanaPriceResponse,
} from "../Home/services/homeApiClient";
import { homeApiClient } from "../Home/services/homeApiClient";
import { trackBuy, trackSell } from "./services/analytics";
import {
  coinApiClient,
  type PumpfunCoinResponse,
} from "./services/coinApiClient";
import TradeFailure from "./tradeFailure";
import TradeSuccess from "./tradeSuccess";
import { getUserTokens } from "@/utils/getUserToken";
import useUserStore from "@/stores/useUserStore";

export type TradeModuleProps = {
  currentPrice: string;
  holders: number | string;
  tokenDetails: AgentResponse;
  pumpfunData: PumpfunCoinResponse | undefined;
};

function TradeModule(props: TradeModuleProps) {
  const toast = useToast();
  const router = useRouter();
  const { publicKey, sendTransaction } = useWallet();
  const { profile } = useUserStore();
  const { connection } = useConnection();
  const [active, setActive] = useState("buy");
  const [solPrice, setSolPrice] = useState<SolanaPriceResponse>();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<string>();
  const [dollarInput, setDollarInput] = useState<string | number>();
  const [output, setOutput] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedSol, setSelectedSol] = useState(0.1);
  const [screenNumber, setScreenNumber] = useState(0); // 0 for initial screen, 1 for success screen and 2 for failure screen
  const [walletBalance, setWalletBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [successDetails, setSuccesDetails] = useState({
    bought: true,
    tickerAmount: 0,
    solAmount: 0,
    txn: "",
  });

  const buttons = [0.1, 0.5, 1, 5];

  const sendTrade = async (data: any) => {
    try {
      await coinApiClient.sendTrade(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrice = async () => {
    try {
      setLoading(true);
      const resp = await homeApiClient.solPrice();
      setSolPrice(resp);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (profile?.profile?.public_key) {
      const coinsHeld = await getUserTokens(
        profile?.profile?.public_key as string
      );
      const balanceObj = coinsHeld.find(
        (b) => b.mint === props.tokenDetails.mint_public_key
      );
      setWalletBalance(balanceObj ? balanceObj.balance : 0);
    }
  };

  const fetchSolBalance = async () => {
    if (publicKey) {
      const solBalance = await connection.getBalance(new PublicKey(publicKey));
      setSolBalance(solBalance / 1000000000);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchSolBalance();

    const intervalId = setInterval(() => {
      fetchBalance();
      fetchSolBalance();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const setToken = async (amount: string) => {
    try {
      if (!amount) return;

      const tmp = await pumpFunSdk.getBondingCurveAccount(
        new PublicKey(props.tokenDetails.mint_public_key)
      );

      const pumpdata = await coinApiClient.fetchPumpfunData(
        props.tokenDetails.mint_public_key
      );

      if (active === "buy") {
        const buy = tmp!.getBuyPrice(parseFloat(amount) * LAMPORTS_PER_SOL);
        setOutput((buy / 10 ** 6).toFixed(8));
        setDollarInput(
          parseFloat(amount) *
            parseFloat(solPrice?.solana.usd.toString() || "1")
        );
      } else {
        const feeBasisPoints = 100;
        const amt = parseInt(amount, 10);
        const n =
          (amt * pumpdata.virtual_sol_reserves) /
          (pumpdata.virtual_token_reserves + amt);

        const a = (n * feeBasisPoints) / 10000;
        const sell = (n - a) / 100;
        if (
          parseFloat(sell.toFixed(8)) < parseFloat(Number(0.000001).toFixed(6))
        ) {
          setOutput(sell.toExponential(1));
        } else {
          setOutput(sell.toFixed(8));
        }
        setDollarInput(parseFloat(amount) * parseFloat(props.currentPrice));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const placeTrade = async () => {
    try {
      if (props.pumpfunData?.complete) {
        window.open(getRaydiumLink(props.tokenDetails.mint_public_key));
        return;
      }
      if (!publicKey) {
        throw new Error("connect your wallet");
      }
      if (!input) {
        throw new Error("invalid input");
      }
      setSubmitting(true);
      const pumpFunData = await coinApiClient.fetchPumpfunData(
        props.tokenDetails.mint_public_key
      );
      let txn;
      if (active === "buy") {
        if (pumpFunData?.not_on_pumpfun) {
          console.log("not on pump fun");
          txn = await pumpFunSdk.createAndBuyXAgent(
            new PublicKey(publicKey),
            new PublicKey(props.tokenDetails.mint_public_key),
            parseFloat(input) * LAMPORTS_PER_SOL,
            100
          );
        } else {
          txn = await pumpFunSdk.buy(
            new PublicKey(publicKey),
            new PublicKey(props.tokenDetails.mint_public_key),
            parseFloat(input) * LAMPORTS_PER_SOL,
            100
          );
        }
      } else {
        txn = await pumpFunSdk.sell(
          new PublicKey(publicKey),
          new PublicKey(props.tokenDetails.mint_public_key),
          parseFloat(input) * 10 ** 6,
          100
        );
      }

      if (active === "sell" && Number(input ?? 0) > walletBalance) {
        toast({
          title: "Transaction failed",
          description: "Insufficient Balance",
          status: "error",
          position: "bottom-right",
        });
        setScreenNumber(2);
        return;
      }

      const txnResp = await sendTransaction(txn, connection);
      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txnResp,
      });

      switch (active) {
        case "buy": {
          const platformFeesInSol =
            (FEES.trade_fees.amount / 100) * parseFloat(input);
          trackBuy({
            agent_address: props.tokenDetails.mint_public_key,
            timestamp: Date.now(),
            wallet_address: publicKey.toString(),
            amount_of_coins_bought_dollar:
              parseFloat(input) * (solPrice?.solana.usd || 169.551),
            revenue_in_dollar:
              platformFeesInSol * (solPrice?.solana.usd || 169.551),
            amount_of_coins_bought_sol: parseFloat(input),
            revenue_in_sol: platformFeesInSol,
          });
          sendTrade({
            ticker: props.tokenDetails.ticker,
            mintAddress: props.tokenDetails.mint_public_key,
            isBuy: true,
            amount: parseFloat(input),
          });
          setSuccesDetails({
            bought: true,
            tickerAmount: parseFloat(output ?? "0"),
            solAmount: parseFloat(input),
            txn: txnResp,
          });
          break;
        }
        case "sell": {
          trackSell({
            agent_address: props.tokenDetails.mint_public_key,
            timestamp: Date.now(),
            wallet_address: publicKey.toString(),
            amount_of_coins_sold_dollar: parseFloat(
              dollarInput?.toString() || "0"
            ),
            amount_of_coins_sold_token: parseFloat(input),
          });
          sendTrade({
            ticker: props.tokenDetails.ticker,
            mintAddress: props.tokenDetails.mint_public_key,
            isBuy: false,
            amount: parseFloat(input),
          });
          setSuccesDetails({
            bought: false,
            tickerAmount: parseFloat(input),
            solAmount: parseFloat(output ?? "0"),
            txn: txnResp,
          });
          break;
        }
        default: {
          logger.log("default case");
        }
      }

      toast({
        title: "Success",
        description: "Txn submitted successfully",
        status: "success",
        position: "bottom-right",
      });
      setScreenNumber(1);
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        position: "bottom-right",
      });
      setScreenNumber(2);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setOutput("");
    setDollarInput("");
    setInput("");
  }, [active]);

  useEffect(() => {
    fetchPrice();
  }, []);

  return (
    <Stack flexGrow="1" bg="#1B1B1E">
      {screenNumber === 0 ? (
        <Stack
          spacing="0.5rem"
          padding="1rem"
          backgroundColor="grey.50"
          borderRadius="0.5rem"
          gap="1rem"
        >
          <HStack
            justifyContent="flex-start"
            opacity={props.pumpfunData?.complete ? "0.6" : "1"}
            width="30vw"
          >
            <Button
              backgroundColor={active === "buy" ? "#18CA2A" : "transparent"}
              color={active === "buy" ? "white" : "grey"}
              borderRadius="0"
              variant="ghosted"
              _hover={{
                opacity: 0.8,
              }}
              onClick={() => setActive("buy")}
              isDisabled={!!props.pumpfunData?.complete}
            >
              Buy
            </Button>
            <Button
              backgroundColor={active === "sell" ? "red.50" : "transparent"}
              borderRadius="0"
              color={active === "sell" ? "white" : "grey"}
              _hover={{
                opacity: 0.8,
              }}
              variant="ghosted"
              onClick={() => setActive("sell")}
              isDisabled={!!props.pumpfunData?.complete}
            >
              Sell
            </Button>
          </HStack>

          <VStack alignItems="flex-start" gap="4px">
            <Text color="text.100" fontSize="10px">
              YOU PAY
            </Text>
            {active === "buy" && (
              <HStack width="100%" gap="5px">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    borderRadius="0"
                    onClick={() => {
                      setInput(button as any);
                      setToken(button as any);
                      setSelectedSol(button);
                    }}
                    bg={selectedSol === button ? "white" : "#222227"}
                    color={selectedSol === button ? "black" : "#818181"}
                    _hover={{
                      bg: selectedSol === button ? "white" : "#333",
                    }}
                    padding="10px 20px"
                    fontSize="12px"
                  >
                    {button} SOL
                  </Button>
                ))}
              </HStack>
            )}
          </VStack>

          <InputGroup
            opacity={props.pumpfunData?.complete ? "0.6" : "1"}
            borderRadius="0"
          >
            <Input
              backgroundColor="grey.100"
              border={0}
              focusBorderColor="grey.50"
              onChange={(e) => {
                setInput(e.target.value);
                setToken(e.target.value);
              }}
              disabled={!!props.pumpfunData?.complete}
              value={input}
              type="number"
              borderRadius="0"
            />
            <InputRightAddon
              backgroundColor="grey.100"
              border={0}
              borderRadius="0"
            >
              {active === "buy" ? "SOL" : `${props.tokenDetails.ticker}`}
            </InputRightAddon>
          </InputGroup>
          <HStack justifyContent="flex-end">
            <Text fontSize="12px">
              Bal:{" "}
              {active == "buy"
                ? solBalance + " SOL"
                : `${walletBalance} $${props.tokenDetails.ticker}`}
            </Text>
          </HStack>

          <VStack alignItems="flex-start" gap="4px">
            <Text color="text.100" fontSize="10px">
              YOU GET
            </Text>
            <InputGroup opacity={props.pumpfunData?.complete ? "0.6" : "1"}>
              <Input
                backgroundColor="grey.100"
                border={0}
                focusBorderColor="grey.50"
                disabled
                _disabled={{
                  backgroundColor: "grey.100",
                }}
                value={output}
                borderRadius="0"
              />
              <InputRightAddon
                backgroundColor="grey.100"
                border={0}
                borderRadius="0"
              >
                {active === "sell" ? "SOL" : `${props.tokenDetails.ticker}`}
              </InputRightAddon>
            </InputGroup>
          </VStack>
          <HStack justifyContent="flex-end">
            <Text fontSize="12px">
              Bal:{" "}
              {active == "sell"
                ? solBalance + "SOL"
                : `${walletBalance} $${props.tokenDetails.ticker}`}
            </Text>
          </HStack>

          <Button
            mt="4px"
            onClick={placeTrade}
            isLoading={submitting}
            style={{
              borderRadius: "0",
              fontSize: "16px",
              backgroundColor: props.pumpfunData?.complete
                ? "white"
                : active === "buy"
                  ? "#18CA2A"
                  : "#c25959",
              color: props.pumpfunData?.complete ? "black" : "white",
            }}
          >
            {props.pumpfunData?.complete
              ? "Trade on Raydium"
              : active === "buy"
                ? "Buy"
                : "Sell"}
          </Button>

          <Box
            borderTop="1px solid #29292E"
            paddingTop="10px"
            margin="0 5px"
            display="flex"
            flexDirection="column"
            gap="5px"
            transform="uppercase"
          >
            <Text
              textAlign="left"
              fontSize="12px"
              fontWeight="bold"
              opacity={props.pumpfunData?.complete ? "0.6" : "1"}
            >
              1 {active === "buy" ? "SOL" : `${props.tokenDetails.ticker}`} =
              &nbsp;
              {active === "buy" ? (
                //@ts-ignore
                `${solPrice?.solana.usd / (props.currentPrice === 0 ? 1 : props.currentPrice)} ${props.tokenDetails.ticker}` ||
                "$164.84"
              ) : (
                <>
                  <span>
                    {" "}
                    {(
                      (parseFloat(props.currentPrice) * 10) /
                      (solPrice?.solana.usd ?? 237)
                    ).toFixed(15)}
                    &nbsp;SOL
                  </span>
                </>
              )}
            </Text>
            {active === "sell" && Number(input ?? 0) > walletBalance && (
              <Text fontSize="12px" color="red.500">
                *You currently have {walletBalance} ${props.tokenDetails.ticker}{" "}
                in your wallet. Insufficient amount.
              </Text>
            )}
            {active === "buy" && Number(input ?? 0) > solBalance && (
              <Text fontSize="12px" color="red.500">
                *You currently have {solBalance} SOL in your wallet.
                Insufficient amount.
              </Text>
            )}

            {/* <HStack
              width="100%"
              justifyContent="space-between"
              color="text.100"
              fontSize="10px"
            >
              <Text textAlign="left">SLIPAGE</Text>
              <Text textAlign="right">1%</Text>
            </HStack>
            <HStack
              width="100%"
              justifyContent="space-between"
              color="text.100"
              fontSize="10px"
            >
              <Text textAlign="left">Price Impact</Text>
              <Text textAlign="right">12%</Text>
            </HStack>
            <HStack
              width="100%"
              justifyContent="space-between"
              color="text.100"
              fontSize="10px"
            >
              <Text textAlign="left">Minimum</Text>
              <Text textAlign="right">TICKER</Text>
            </HStack> */}
          </Box>
        </Stack>
      ) : screenNumber === 1 ? (
        <TradeSuccess
          tokenDetails={props.tokenDetails}
          successDetails={successDetails}
          setScreen={setScreenNumber}
        />
      ) : (
        <TradeFailure setScreenNumber={setScreenNumber} />
      )}
    </Stack>
  );
}

export default TradeModule;
