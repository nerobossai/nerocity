import { Avatar, HStack, Text } from "@chakra-ui/react";
import dateFormat from "dateformat";
import { useRouter } from "next/navigation";
import React from "react";

function ChatRowComponent(props: any) {
  const router = useRouter();
  return (
    <HStack
      justifyContent="space-between"
      backgroundColor={props.is_agent ? "#1F2E22" : "transparent"}
      padding="0.5rem"
      borderRadius="0.5rem"
      fontSize="12px"
    >
      <HStack
        onClick={() => router.push(`/profile/${props.user_details.username}`)}
        cursor="pointer"
      >
        <Avatar boxSize="30px" src={props.user_details.profile_pic} />
        <Text
          padding="0.3rem"
          borderRadius="0.5rem"
          backgroundColor={props.isAgent ? "#1F2E22" : "blue.50"}
          color={props.isAgent ? "black" : "white"}
          fontWeight="bold"
        >
          @{props.user_details.username}
        </Text>
        <Text opacity={0.8}>{props.message}</Text>
      </HStack>
      <Text className="text-[8px] sm:text-xs">
        {dateFormat(
          new Date(parseInt(props.timestamp, 10)),
          "HH:MM TT, dS mmm yyyy",
        )}
      </Text>
    </HStack>
  );
}

export default ChatRowComponent;
