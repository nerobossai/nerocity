import { Avatar, HStack, Text } from "@chakra-ui/react";
import dateFormat from "dateformat";
import React from "react";

function ChatRowComponent(props: any) {
  return (
    <HStack
      justifyContent="space-between"
      backgroundColor={props.isAgent ? "green.100" : "transparent"}
      padding="0.5rem"
      borderRadius="0.5rem"
      fontSize="12px"
    >
      <HStack>
        <Avatar boxSize="30px" />
        <Text
          padding="0.3rem"
          borderRadius="0.5rem"
          backgroundColor={props.isAgent ? "green.50" : "blue.50"}
          color={props.isAgent ? "black" : "white"}
          fontWeight="bold"
        >
          @{props.userDetails.name}
        </Text>
        <Text opacity={0.8}>{props.data}</Text>
      </HStack>
      <Text>
        {dateFormat(new Date(props.createdAt), "HH:MM TT, dS mmm yyyy")}
      </Text>
    </HStack>
  );
}

export default ChatRowComponent;
