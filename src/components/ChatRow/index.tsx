import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

import { timeDifference } from "@/utils/timeDifference";

function ChatRowComponent(props: any) {
  const router = useRouter();
  return (
    <VStack
      width="100%"
      alignItems="flex-start"
      backgroundColor={props.is_agent ? "#04200A" : "transparent"}
      padding={props.is_agent ? "1rem 0.5rem" : "0 0.5rem"}
      fontSize="12px"
    >
      <HStack
        onClick={() => router.push(`/profile/${props.user_details.username}`)}
        cursor="pointer"
      >
        <Avatar boxSize="30px" src={props.user_details.profile_pic} />
        <Text
          padding="0.3rem 0 0 0.3rem"
          borderRadius="0.5rem"
          backgroundColor={props.isAgent ? "#1F2E22" : "blue.50"}
          color={props.isAgent ? "black" : "white"}
          fontWeight="bold"
        >
          @{props.user_details.username}
        </Text>
        <Text fontSize="10px" color="#645F5F">
          {timeDifference(Date.now(), parseInt(props.timestamp.toString(), 10))}
        </Text>
      </HStack>
      <Text fontSize="16px" ml="40px">
        {props.message}
      </Text>
    </VStack>
  );
}

export default ChatRowComponent;
