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
import React, { useEffect, useRef, useState } from "react";
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
      textAreaRef.current.style.height = "auto"; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust to fit content
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

  const fetchChats = async () => {
    try {
      setLoading(true);
      const chats = await coinApiClient.fetchChats(props.agentId);
      setSelectedMessageId(
        chats.chats.length <= 0
          ? undefined
          : chats.chats[chats.chats.length - 1]?.message_id
      );
      console.log(chats);
      setChats(chats);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Wallet not connect!",
        description: "Please connect wallet to comment!<",
        status: "error",
        position: "bottom-right",
      });
      return;
    }
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
    const intervalId = setInterval(() => {
      console.log("polling chats ser");
      fetchChats();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

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
            Display this Stack only if reply button is clicked
            {selectedMessageId === data.message_id && (
              <Stack marginLeft="3rem">
                {data.replies
                  .sort(
                    (a, b) =>
                      parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10)
                  )
                  .map((rData, v: number) => {
                    return <ChatRowComponent {...rData} key={v} />;
                  })}{" "}
                <AddComment
                  comment={comment}
                  setComment={setComment}
                  isAuthenticated={isAuthenticated}
                  onSubmit={() => handleSubmit()}
                  posting={posting}
                  onBlur={() => {
                    // setSelectedMessageId(undefined);
                  }}
                />
              </Stack>
            )}
            <Box
              display="flex"
              paddingRight="20px"
              gap="10px"
              marginLeft="0.5rem"
            >
              {/* <Box
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
                      : data.message_id,
                  );
                }}
                display="flex"
                gap="5px"
                alignItems="center"
                cursor="pointer"
              >
                <FaRegHeart />
              </Box> */}
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
