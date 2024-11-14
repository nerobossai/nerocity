import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
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
    } catch (err) {
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
    <Stack marginTop="1rem" flexGrow="1">
      <HStack
        spacing="3rem"
        padding="1rem"
        backgroundColor="grey.50"
        borderRadius="0.5rem"
        justifyContent="space-evenly"
      >
        <VStack
          color="green.50"
          textAlign="center"
          fontWeight="bold"
          fontSize="12px"
        >
          <Text>Price</Text>
          <SubscriptText value={props.currentPrice} />
        </VStack>
        <VStack textAlign="center" fontWeight="bold" fontSize="12px">
          <Text>Holders</Text>
          <Text>{props.holders}</Text>
        </VStack>
      </HStack>
      <Stack
        spacing="0.5rem"
        padding="1rem"
        backgroundColor="grey.50"
        borderRadius="0.5rem"
      >
        <HStack
          justifyContent="center"
          opacity={props.pumpfunData?.complete ? "0.6" : "1"}
        >
          <Button
            backgroundColor={active === "buy" ? "green.100" : "black"}
            color={active === "buy" ? "white" : "grey"}
            width="30vw"
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
            backgroundColor={active === "sell" ? "red.50" : "black"}
            color={active === "sell" ? "white" : "grey"}
            _hover={{
              opacity: 0.8,
            }}
            variant="ghosted"
            width="30vw"
            onClick={() => setActive("sell")}
            isDisabled={!!props.pumpfunData?.complete}
          >
            Sell
          </Button>
        </HStack>
        <InputGroup opacity={props.pumpfunData?.complete ? "0.6" : "1"}>
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
          />
          <InputRightAddon backgroundColor="grey.100" border={0}>
            {active === "buy" ? "SOL" : `${props.tokenDetails.ticker}`}
          </InputRightAddon>
        </InputGroup>
        <HStack
          justifyContent="space-between"
          opacity={props.pumpfunData?.complete ? "0.6" : "1"}
        >
          <Text fontSize="10px" fontWeight="bold">
            ${dollarInput}
          </Text>
          <Text fontSize="10px" fontWeight="bold">
            1 {active === "buy" ? "SOL" : `${props.tokenDetails.ticker}`} ={" "}
            {loading ? (
              <Spinner />
            ) : active === "buy" ? (
              `$${solPrice?.solana.usd}` || "$164.84"
            ) : (
              `$${props.currentPrice}`
            )}
          </Text>
        </HStack>
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
          />
          <InputRightAddon backgroundColor="grey.100" border={0}>
            {active === "sell" ? "SOL" : `${props.tokenDetails.ticker}`}
          </InputRightAddon>
        </InputGroup>
        <Text
          textAlign="end"
          fontSize="10px"
          fontWeight="bold"
          opacity={props.pumpfunData?.complete ? "0.6" : "1"}
        >
          1 {active === "sell" ? "SOL" : `${props.tokenDetails.ticker}`} = $
          {active === "sell"
            ? `${solPrice?.solana.usd}` || "$164.84"
            : props.currentPrice}
        </Text>
        <Button onClick={placeTrade} isLoading={submitting}>
          {props.pumpfunData?.complete ? "Trade on Raydium" : "Place Trade"}
        </Button>
      </Stack>
    </Stack>
  );
}

export default TradeModule;
