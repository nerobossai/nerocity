import {
  Button,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import ChatModelComponent from "@/components/ChatModel";
import ChatRowComponent from "@/components/ChatRow";

import type { ChatsResponse } from "./services/coinApiClient";
import { coinApiClient } from "./services/coinApiClient";

function ChatModule(props: { agentId: string }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | undefined
  >();
  const [posting, setPosting] = useState(false);
  const [chats, setChats] = useState<ChatsResponse>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setPosting(true);
      const resp = await coinApiClient.sendMessage({
        message_id: selectedMessageId,
        message: comment,
        agent_id: props.agentId,
        is_reply: !!selectedMessageId,
      });
      onClose();
      toast({
        title: "Success",
        description: "message added successfully",
        status: "success",
        position: "bottom-right",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "something went wrong!",
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setPosting(false);
    }
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const chats = await coinApiClient.fetchChats(props.agentId);
      console.log(chats);
      setChats(chats);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <Stack backgroundColor="grey.50" padding="1rem">
      <Text>Chat with agent and users</Text>
      {loading ? (
        <Spinner />
      ) : (
        (chats?.chats || []).map((data, idx) => {
          return (
            <Stack key={data.message_id}>
              <ChatRowComponent {...data} />
              <Stack marginLeft="3rem">
                {data.replies.map((rData, rIdx) => {
                  return <ChatRowComponent {...rData} key={rData.message_id} />;
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
                  onClick={() => {
                    setSelectedMessageId(data.message_id);
                    onOpen();
                  }}
                >
                  Reply
                </Button>
              </Stack>
            </Stack>
          );
        })
      )}
      <Button
        fontSize="12px"
        color="white"
        width="20%"
        variant="ghosted"
        marginTop="0.5rem"
        backgroundColor="grey.100"
        _hover={{
          opacity: 0.8,
        }}
        onClick={() => {
          setSelectedMessageId(undefined);
          onOpen();
        }}
      >
        Post Message
      </Button>
      <ChatModelComponent
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedMessageId(undefined);
        }}
        onSubmit={handleSubmit}
        isLoading={posting}
        onChangeMessage={setComment}
      />
    </Stack>
  );
}

export default ChatModule;
