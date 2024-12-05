import {
  Box,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useRef, useState } from "react";
import { FaRegComment } from "react-icons/fa6";

import ChatRowComponent from "@/components/ChatRow";
import useUserStore from "@/stores/useUserStore";

import type { ChatsResponse } from "./services/coinApiClient";
import { coinApiClient } from "./services/coinApiClient";
import AddCommentUpdated from "./addComment";

function ChatModule(props: { agentId: string }) {
  const { publicKey } = useWallet();
  const [comment, setComment] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | undefined
  >();
  const [chats, setChats] = useState<ChatsResponse>();
  const [loading, setLoading] = useState(false);
  const [openedComments, setOpenedComments] = useState<string[]>([]);


  const { isAuthenticated } = useUserStore();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const chatsResponse = await coinApiClient.fetchChats(props.agentId);
      console.log("chat res", chatsResponse);
      setChats(chatsResponse);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchChats();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchChats();
  }, [])


  const toggleComment = (id: string) => {
    setOpenedComments((prev) =>
      prev.includes(id)
        ? prev.filter((commentId) => commentId !== id)
        : [...prev, id]
    );
  };

  return (
    <Stack paddingTop="1rem" flexGrow="1" marginBottom="4rem">
      <AddCommentUpdated
        comment={comment}
        setComment={setComment}
        isAuthenticated={isAuthenticated}
        onSubmit={() => fetchChats()}
        onFocus={() => setSelectedMessageId(undefined)}
        publicKey={publicKey}
        agentId={props.agentId}
        selectedMessageId={selectedMessageId}
      />
      {(chats?.chats || []).map((data, r) => {
        return (
          <Stack key={r} gap="0.5rem">
            <ChatRowComponent {...data} />
            Display this Stack only if reply button is clicked
            {openedComments.includes(data.message_id) && (
              <Stack marginLeft="3rem">
                {data.replies
                  .sort(
                    (a, b) =>
                      parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10)
                  )
                  .map((rData, v: number) => {
                    return <ChatRowComponent {...rData} key={v} />;
                  })}{" "}
                <AddCommentUpdated
                  comment={comment}
                  setComment={setComment}
                  isAuthenticated={isAuthenticated}
                  onFocus={() => setSelectedMessageId(data.message_id)}
                  onSubmit={() => fetchChats()}
                  publicKey={publicKey}
                  agentId={props.agentId}
                  selectedMessageId={selectedMessageId}
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
                  toggleComment(data.message_id);
                }}
                display="flex"
                gap="5px"
                alignItems="center"
                cursor="pointer"
              >
                <FaRegComment />{" "}
                <Text color="text.100">
                  {openedComments.includes(data.message_id) ? "Hide" : "Show"}{" "}
                  {data.replies.length} replies
                </Text>
              </Box>
            </Box>
          </Stack>
        );
      })}
      {(loading && (chats?.chats.length ?? 0) === 0) && (
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
    </Stack>
  );
}

export default ChatModule;
