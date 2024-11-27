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
import React, { useEffect, useState } from "react";

import SubscriptText from "@/components/SubscriptText";
import { pumpFunSdk } from "@/services/pumpfun";
import { getGeckoterminalLink } from "@/utils";
import { logger } from "@/utils/Logger";

import type {
  AgentResponse,
  SolanaPriceResponse,
} from "../Home/services/homeApiClient";
import { homeApiClient } from "../Home/services/homeApiClient";
import { trackBuy, trackSell } from "./services/analytics";
import type { PumpfunCoinResponse } from "./services/coinApiClient";
import TradeFailure from "./tradeFailure";
import TradeSuccess from "./tradeSuccess";

export type TradeModuleProps = {
  currentPrice: string;
  holders: number | string;
  tokenDetails: AgentResponse;
  pumpfunData: PumpfunCoinResponse | undefined;
};

function TradeModule(props: TradeModuleProps) {
  const toast = useToast();
  const { publicKey, sendTransaction } = useWallet();
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

  const buttons = [0.1, 0.5, 1, 5];

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

  const setToken = async (amount: string) => {
    try {
      if (!amount) return;

      const tmp = await pumpFunSdk.getBondingCurveAccount(
        new PublicKey(props.tokenDetails.mint_public_key),
      );

      if (active === "buy") {
        const buy = tmp!.getBuyPrice(parseFloat(amount) * LAMPORTS_PER_SOL);
        setOutput((buy / 10 ** 6).toFixed(8));
        setDollarInput(
          parseFloat(amount) *
            parseFloat(solPrice?.solana.usd.toString() || "1"),
        );
      } else {
        const sell = tmp!.getSellPrice(parseInt(amount, 10), 100) / 100;
        if (
          parseFloat(sell.toFixed(8)) < parseFloat(Number(0.000001).toFixed(6))
        ) {
          setOutput(sell.toExponential(1));
        } else {
          setOutput(sell.toFixed(8));
        }
        setDollarInput(parseFloat(amount) * parseFloat(props.currentPrice));
      }
      setScreenNumber(1);
    } catch (err) {
      setScreenNumber(2);
      console.log(err);
    }
  };

  const placeTrade = async () => {
    try {
      if (props.pumpfunData?.complete) {
        window.open(getGeckoterminalLink(props.pumpfunData?.raydium_pool));
        return;
      }

      if (!publicKey) {
        throw new Error("connect your wallet");
      }
      if (!input) {
        throw new Error("invalid input");
      }
      setSubmitting(true);
      let txn;
      if (active === "buy") {
        txn = await pumpFunSdk.buy(
          new PublicKey(publicKey),
          new PublicKey(props.tokenDetails.mint_public_key),
          parseFloat(input) * LAMPORTS_PER_SOL,
          100,
        );
      } else {
        txn = await pumpFunSdk.sell(
          new PublicKey(publicKey),
          new PublicKey(props.tokenDetails.mint_public_key),
          parseFloat(input) * 10 ** 6,
          100,
        );
      }

      const txnResp = await sendTransaction(txn, connection);
      // await connection.confirmTransaction(txnResp, "confirmed");

      // for analytics
      switch (active) {
        case "buy": {
          const platformFeesInSol = (2 / 100) * parseFloat(input);
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
          break;
        }
        case "sell": {
          trackSell({
            agent_address: props.tokenDetails.mint_public_key,
            timestamp: Date.now(),
            wallet_address: publicKey.toString(),
            amount_of_coins_sold_dollar: parseFloat(
              dollarInput?.toString() || "0",
            ),
            amount_of_coins_sold_token: parseFloat(input),
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
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        position: "bottom-right",
      });
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
              1 {active === "sell" ? "SOL" : `${props.tokenDetails.ticker}`} =
              &nbsp;
              {active === "sell" ? (
                `$${solPrice?.solana.usd}` || "$164.84"
              ) : (
                <SubscriptText value={props.currentPrice} />
              )}
            </Text>
            <HStack
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
            </HStack>
          </Box>
        </Stack>
      ) : screenNumber === 1 ? (
        <TradeSuccess tokenDetails={props.tokenDetails} />
      ) : (
        <TradeFailure setScreenNumber={setScreenNumber} />
      )}
    </Stack>
  );
}

export default TradeModule;
