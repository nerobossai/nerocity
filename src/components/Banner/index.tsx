import { Box, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function Banner() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // const ws = new WebSocket("wss://echo-websocket.hoppscotch.io");
    const ws = new WebSocket("ws://3.108.223.130/ws");

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onclose = (event) => console.log("WebSocket closed:", event);
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onmessage = (event) => console.log("Message received:", event.data);

    // ws.onmessage = (event) => {
    //   try {
    //     const data = JSON.parse(event.data);
    //     console.log("dddd", data);
    //     // setMessages((prev) => [data, ...prev].slice(0, 4)); // Keep the latest 4 messages
    //   } catch (err) {
    //     console.error("Error parsing WebSocket message:", err);
    //   }
    // };

    // ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    // };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <HStack
      height="40px"
      justifyContent="center"
      fontSize="12px"
      py="10px"
      overflow="hidden"
      bg="green.400"
      display="flex"
      gap="20px"
    >
      <Box color="green.100">+12.12 SOL OF TEST TICKER BOUGHT</Box>
      <Box color="#FF3838">+12.12 SOL OF TEST TICKER SOLD</Box>
      <Box color="green.100">+12.12 SOL OF TEST TICKER BOUGHT</Box>
      <Box color="#FF3838">-12.12 SOL OF TEST TICKER SOLD</Box>
      {messages.map((message, index) => (
        <Box
          key={index}
          color={message.is_buy ? "green.100" : "#FF3838"}
        >
          {`${message.is_buy ? "+" : "-"}${(
            message.token_amount / 10 ** 9
          ).toFixed(2)} ${message.symbol.toUpperCase()} ${message.is_buy ? "BOUGHT" : "SOLD"
            }`}
        </Box>
      ))}
    </HStack>
  );
}

export default Banner;
