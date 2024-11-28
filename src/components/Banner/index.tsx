import { Box, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function Banner() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // const ws = new WebSocket("wss://echo-websocket.hoppscotch.io");
    const ws = new WebSocket("wss://wss.neroboss.ai");

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onclose = (event) => console.log("WebSocket closed:", event);
    // ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onmessage = (event) => console.log("Message received:", event.data);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)){
          const updatedData = data.filter((d) => d.ticker);
          setMessages(updatedData.slice(0, 4));
        }else{
          let updatedMessages = messages;
          updatedMessages.push(data);
          if (updatedMessages.length > 4) {
            updatedMessages = updatedMessages.slice(updatedMessages.length - 4);
          }
          if (data.ticker) {
            setMessages(updatedMessages);
          }
        }
        
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  if (messages.filter((m) => m.ticker !== undefined).length === 0) {
    return null;
  }
  
  return (
    <HStack
      minHeight="40px"
      justifyContent="center"
      fontSize={{ base: "10px", sm: "12px" }}
      py="10px"
      px="2%"
      overflow="hidden"
      bg="#04200A"
      display="flex"
      gap="20px"
    >
      {messages.map((message, index) => (
        <Box key={index} color={message.isBuy ? "green.100" : "#FF3838"}>
          {`${message.isBuy ? "+" : "-"}${(
            message.amount /
            10 ** 9
          ).toFixed(2)} ${message.ticker?.toUpperCase()} ${
            message?.isBuy ? "BOUGHT" : "SOLD"
          }`}
        </Box>
      ))}
    </HStack>
  );
}

export default Banner;
