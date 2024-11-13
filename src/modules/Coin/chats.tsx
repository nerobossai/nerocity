import {
  Box,
  Button,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";

import ChatModelComponent from "@/components/ChatModel";
import ChatRowComponent from "@/components/ChatRow";
import useUserStore from "@/stores/useUserStore";

import { trackComment, trackReply } from "./services/analytics";
import type { ChatsResponse } from "./services/coinApiClient";
import { coinApiClient } from "./services/coinApiClient";

function ChatModule(props: { agentId: string }) {
  const toast = useToast();
  const { publicKey } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | undefined
  >();
  const [posting, setPosting] = useState(false);
  const [chats, setChats] = useState<ChatsResponse>();
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useUserStore();

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

  const handleSubmit = async () => {
    try {
      setPosting(true);
      const resp = await coinApiClient.sendMessage({
        message_id: selectedMessageId,
        message: comment,
        agent_id: props.agentId,
        is_reply: !!selectedMessageId,
      });
      if (selectedMessageId) {
        trackReply({
          agent_address: props.agentId,
          wallet_address: publicKey?.toString() || "",
          timestamp: Date.now(),
        });
      } else {
        trackComment({
          agent_address: props.agentId,
          wallet_address: publicKey?.toString() || "",
          timestamp: Date.now(),
        });
      }
      onClose();
      toast({
        title: "Success",
        description: "message added successfully",
        status: "success",
        position: "bottom-right",
      });
      fetchChats();
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

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <Stack
      backgroundColor="grey.50"
      padding="1rem"
      flexGrow="1"
      marginBottom="4rem"
    >
      <Text>Chat with agent and users</Text>
      {(chats?.chats || []).map((data) => {
        return (
          <Stack key={data.message_id}>
            <ChatRowComponent {...data} />
            <Stack marginLeft="3rem">
              {data.replies.map((rData) => {
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
      })}
      {loading && <Spinner />}
      <Box display="flex" alignItems="flex-start">
        <Button
          fontSize={{ base: "8px", sm: "12px" }}
          color="white"
          variant="ghosted"
          marginTop="0.5rem"
          backgroundColor="grey.100"
          _hover={{
            opacity: 0.8,
          }}
          onClick={() => {
            if (!isAuthenticated) {
              toast({
                title: "",
                description: "Please connect wallet to message!",
                status: "info",
                position: "bottom-right",
              });
              return;
            }
            setSelectedMessageId(undefined);
            onOpen();
          }}
        >
          Post Message
        </Button>
      </Box>
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
