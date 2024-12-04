import {
  Box,
  Button,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState, useRef } from "react";
import { FaRegComment } from "react-icons/fa6";

import ChatModelComponent from "@/components/ChatModel";
import ChatRowComponent from "@/components/ChatRow";
import useUserStore from "@/stores/useUserStore";

import { trackComment, trackReply } from "./services/analytics";
import type { ChatsResponse } from "./services/coinApiClient";
import { coinApiClient } from "./services/coinApiClient";

const AddComment = ({
  comment,
  setComment,
  isAuthenticated,
  onSubmit,
  onFocus,
  onBlur,
  posting,
}: any) => {
  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  return (
    <Box
      width="100%"
      bg="#1B1B1D"
      display="flex"
      padding="0.5rem"
      my="10px"
      gap="10px"
      border="0.5px solid #959595"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Textarea
        ref={textAreaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setComment(e.target.value);
          adjustHeight();
        }}
        rows={1}
        flexGrow="1"
        width="400px" 
        placeholder={
          isAuthenticated
            ? "Add a comment"
            : "Connect your wallet to engage & comment."
        }
        outline="none"
        border="none"
        onFocus={() => onFocus && onFocus()}
        onBlur={() => onBlur && onBlur()}
        disabled={!isAuthenticated}
        _focus={{
          border: "none",
          boxShadow: "none",
        }}
      />
      <Button
        bg="white"
        fontSize="12px"
        color="black"
        borderRadius="0"
        disabled={!isAuthenticated || posting}
        onClick={() => {
          onSubmit();
          setValue("");
        }}
        opacity={posting ? 0.7 : 1}
      >
        {isAuthenticated ? (posting ? "POSTING..." : "POST") : "CONNECT WALLET"}
      </Button>
    </Box>
  );
};

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
  const websocketRef = useRef<WebSocket | null>(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const chats = await coinApiClient.fetchChats(props.agentId);
      setSelectedMessageId(
        chats.chats.length <= 0
          ? undefined
          : chats.chats[chats.chats.length - 1]?.message_id
      );
      setChats(chats);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const ws = new WebSocket(`wss://wss.neroboss.ai?agentId=${props.agentId}`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        fetchChats();
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    websocketRef.current = ws;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Wallet not connected!",
        description: "Please connect wallet to comment!",
        status: "error",
        position: "bottom-right",
      });
      return;
    }

    try {
      setPosting(true);

      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.send(
          JSON.stringify({
            agentId: props.agentId,
            message: comment,
          })
        );
      }

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

      await coinApiClient.sendMessage({
        message_id: selectedMessageId,
        message: comment,
        agent_id: props.agentId,
        is_reply: !!selectedMessageId,
      });

      onClose();
      toast({
        title: "Success",
        description: "Message added successfully",
        status: "success",
        position: "bottom-right",
      });

      fetchChats();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Something went wrong!",
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setPosting(false);
      setComment("");
    }
  };

  useEffect(() => {
    fetchChats();

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [props.agentId]);

  return (
    <Stack paddingTop="1rem" flexGrow="1" marginBottom="4rem">
      <AddComment
        comment={comment}
        setComment={setComment}
        isAuthenticated={isAuthenticated}
        onSubmit={handleSubmit}
        posting={posting}
        onFocus={() => setSelectedMessageId(undefined)}
      />
      {(chats?.chats || []).map((data, r) => {
        return (
          <Stack key={r} gap="0.5rem">
            <ChatRowComponent {...data} />
            {selectedMessageId === data.message_id && (
              <Stack marginLeft="3rem">
                {data.replies
                  .sort(
                    (a, b) =>
                      parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10)
                  )
                  .map((rData, v: number) => {
                    return <ChatRowComponent {...rData} key={v} />;
                  })}
                <AddComment
                  comment={comment}
                  setComment={setComment}
                  isAuthenticated={isAuthenticated}
                  onSubmit={() => handleSubmit()}
                  posting={posting}
                />
              </Stack>
            )}
            <Box
              display="flex"
              paddingRight="20px"
              gap="10px"
              marginLeft="0.5rem"
            >
              <Box
                fontSize="12px"
                color="#8C8C8C"
                backgroundColor="transparent"
                _hover={{
                  opacity: 0.8,
                }}
                onClick={() => {
                  setSelectedMessageId(
                    data.message_id === selectedMessageId
                      ? undefined
                      : data.message_id
                  );
                }}
                display="flex"
                gap="5px"
                alignItems="center"
                cursor="pointer"
              >
                <FaRegComment />{" "}
                <Text color="text.100">
                  {data.message_id === selectedMessageId ? "Hide" : "Show"}{" "}
                  {data.replies.length} replies
                </Text>
              </Box>
            </Box>
          </Stack>
        );
      })}
      {loading && (
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <Spinner />
        </Box>
      )}
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
