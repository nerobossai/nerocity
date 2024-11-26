import {
  Box,
  Button,
  Input,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa6";

import ChatModelComponent from "@/components/ChatModel";
import ChatRowComponent from "@/components/ChatRow";
import useUserStore from "@/stores/useUserStore";

import { trackComment, trackReply } from "./services/analytics";
import type { ChatsResponse } from "./services/coinApiClient";
import { coinApiClient } from "./services/coinApiClient";

const AddComment = ({ comment, setComment, isAuthenticated }: any) => {
  return (
    <Box
      width="100%"
      bg="#1B1B1D"
      display="flex"
      padding="0.5rem"
      my="10px"
      border="0.5px solid #959595"
    >
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        flexGrow="1"
        placeholder={
          isAuthenticated
            ? "Add a comment"
            : "Connect your wallet to engage & comment."
        }
        outline="none"
        border="none"
        disabled={!isAuthenticated}
        _focus={{
          border: "none",
          boxShadow: "none",
        }}
      />
      <Button
        padding="10px 20px"
        bg="white"
        fontSize="12px"
        color="black"
        borderRadius="0"
        disabled={!isAuthenticated}
      >
        {isAuthenticated ? "POST" : "CONNECT WALLET"}
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
    <Stack paddingTop="1rem" flexGrow="1" marginBottom="4rem">
      <AddComment
        comment={comment}
        setComment={setComment}
        isAuthenticated={isAuthenticated}
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
                      parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10),
                  )
                  .map((rData, v: number) => {
                    return <ChatRowComponent {...rData} key={v} />;
                  })}{" "}
                <AddComment
                  comment={comment}
                  setComment={setComment}
                  isAuthenticated={isAuthenticated}
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
                      : data.message_id,
                  );
                }}
                display="flex"
                gap="5px"
                alignItems="center"
                cursor="pointer"
              >
                <FaRegComment /> Reply
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
