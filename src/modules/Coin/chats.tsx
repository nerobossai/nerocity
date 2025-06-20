import { Box, Spinner, Stack, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useRef, useState } from "react";
import { FaRegComment } from "react-icons/fa6";

import ChatRowComponent from "@/components/ChatRow";
import useUserStore from "@/stores/useUserStore";

import AddCommentUpdated from "./addComment";
import type { Chat } from "./services/coinApiClient";
import { coinApiClient } from "./services/coinApiClient";

function ChatModule(props: {
  agentId: string;
  agentImage: string;
  agentName: string;
}) {
  const { publicKey } = useWallet();
  const [comment, setComment] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | undefined
  >();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [openedComments, setOpenedComments] = useState<string[]>([]);

  const { isAuthenticated } = useUserStore();
  const websocketRef = useRef<WebSocket | null>(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const chatsResponse = await coinApiClient.fetchChats(props.agentId);
      // console.log("chats response", chatsResponse);
      setChats(chatsResponse.chats ?? []);
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

  useEffect(() => {
    fetchChats();

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [props.agentId]);

  useEffect(() => {
    fetchChats();
  }, []);

  const toggleComment = (id: string) => {
    setOpenedComments((prev) =>
      prev.includes(id)
        ? prev.filter((commentId) => commentId !== id)
        : [...prev, id],
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
        websocketRef={websocketRef}
        setChats={setChats}
        chats={chats}
        agentImage={props.agentImage}
        agentName={props.agentName}
      />
      {chats.map((data, r) => {
        return (
          <Stack key={r} gap="0.5rem">
            <ChatRowComponent {...data} />
            {openedComments.includes(data.message_id) && (
              <Stack marginLeft="3rem">
                {data.replies
                  .sort(
                    (a, b) =>
                      parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10),
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
                  websocketRef={websocketRef}
                  selectedMessageId={selectedMessageId}
                  setChats={setChats}
                  chats={chats}
                  agentImage={props.agentImage}
                  agentName={props.agentName}
                  setSelectedMessageId={setSelectedMessageId}
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
      {loading && chats.length === 0 && (
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
