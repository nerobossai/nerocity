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

import { pumpFunSdk } from "@/services/pumpfun";

import type {
  AgentResponse,
  SolanaPriceResponse,
} from "../Home/services/homeApiClient";
import { homeApiClient } from "../Home/services/homeApiClient";

export type TradeModuleProps = {
  currentPrice: string;
  holders: number | string;
  tokenDetails: AgentResponse;
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
      connection.confirmTransaction(txnResp, "confirmed");
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
    <Stack marginTop="1rem" padding="1rem" flexGrow="1">
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
          <Text>${props.currentPrice}</Text>
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
        <HStack justifyContent="center">
          <Button
            backgroundColor={active === "buy" ? "green.100" : "black"}
            color={active === "buy" ? "white" : "grey"}
            width="30vw"
            variant="ghosted"
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => setActive("buy")}
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
          >
            Sell
          </Button>
        </HStack>
        <InputGroup>
          <Input
            backgroundColor="grey.100"
            border={0}
            focusBorderColor="grey.50"
            onChange={(e) => {
              setInput(e.target.value);
              setToken(e.target.value);
            }}
            value={input}
            type="number"
          />
          <InputRightAddon backgroundColor="grey.100" border={0}>
            {active === "buy" ? "SOL" : `${props.tokenDetails.ticker}`}
          </InputRightAddon>
        </InputGroup>
        <HStack justifyContent="space-between">
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
        <InputGroup>
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
        <Text textAlign="end" fontSize="10px" fontWeight="bold">
          1 {active === "sell" ? "SOL" : `${props.tokenDetails.ticker}`} = $
          {active === "sell"
            ? `${solPrice?.solana.usd}` || "$164.84"
            : props.currentPrice}
        </Text>
        <Button onClick={placeTrade} isLoading={submitting}>
          Place Trade
        </Button>
      </Stack>
    </Stack>
  );
}

export default TradeModule;
