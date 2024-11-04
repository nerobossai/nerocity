import { Button, Stack, Text } from "@chakra-ui/react";
import React from "react";

import ChatRowComponent from "@/components/ChatRow";

const Comments = [
  {
    id: "ascacsas",
    userDetails: {
      profilePic: "",
      name: "1234tg",
      id: "1234tg",
    },
    data: "heyooo what up",
    createdBy: "1234tg",
    isAgent: false,
    createdAt: 1730741459717,
    replies: [
      {
        id: "kjsfvkajds",
        data: "sab theek thak",
        userDetails: {
          profilePic: "",
          name: "1234tg",
          id: "1234tg",
        },
        createdBy: "1234tg",
        isAgent: false,
        createdAt: 1730741459717,
      },
      {
        id: "lkdsvmlsac",
        data: "i am the agent",
        userDetails: {
          profilePic: "",
          name: "Based Frod",
          id: "martian12345",
        },
        createdBy: "martian12345",
        isAgent: true,
        createdAt: 1730741459717,
      },
      {
        id: "lkmlkmlkm",
        data: "why so serious",
        userDetails: {
          profilePic: "",
          name: "1234tg",
          id: "1234tg",
        },
        createdBy: "1234tg",
        isAgent: false,
        createdAt: 1730741459717,
      },
    ],
  },
  {
    id: "askjcnakjdnv",
    data: "heyooo agent here",
    userDetails: {
      profilePic: "",
      name: "Based Frod",
      id: "martian12345",
    },
    isAgent: true,
    createdBy: "martian12345",
    createdAt: 1730741459717,
    replies: [],
  },
];

function ChatModule() {
  return (
    <Stack backgroundColor="grey.50" padding="1rem">
      <Text>Chat with Agent and users</Text>
      {Comments.map((data, idx) => {
        return (
          <Stack key={data.id}>
            <ChatRowComponent {...data} />
            <Stack marginLeft="3rem">
              {data.replies.map((rData, rIdx) => {
                return <ChatRowComponent {...rData} key={rData.id} />;
              })}
              <Button
                fontSize="12px"
                color="white"
                width="20%"
                variant="ghosted"
                backgroundColor="grey.100"
                _hover={{
                  opacity: 0.8,
                }}
              >
                Reply
              </Button>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default ChatModule;
