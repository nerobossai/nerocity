import { Box, Button, Textarea, useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { trackComment, trackReply } from "./services/analytics";
import { Chat, coinApiClient } from './services/coinApiClient';
import useUserStore from '@/stores/useUserStore';

function addReplyToChat(chats: Chat[], message_id: string, reply: any): any[] {
  return chats.map(chat => {
    if (chat.message_id === message_id) {
      return {
        ...chat,
        replies: [...chat.replies, reply],
      };
    }
    return chat;
  });
}

const AddCommentUpdated = ({
    comment,
    setComment,
    isAuthenticated,
    onSubmit,
    onFocus,
    onBlur,
    selectedMessageId,
    agentId,
    publicKey,
    websocketRef,
    setChats,
    chats,
    agentImage,
    agentName,
    setSelectedMessageId
}: any) => {
    const [value, setValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [posting, setPosting] = useState(false);
    const toast = useToast();
    const { profile } = useUserStore();

    const adjustHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
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
        if (value.trim() === "") return;
        try {
          setPosting(true);
    
          if (
            websocketRef.current &&
            websocketRef.current.readyState === WebSocket.OPEN
          ) {
            websocketRef.current.send(
              JSON.stringify({
                agentId: agentId,
                message: comment,
              })
            );
          }
    
          if (selectedMessageId) {
            trackReply({
              agent_address: agentId,
              wallet_address: publicKey?.toString() || "",
              timestamp: Date.now(),
            });
          } else {
            trackComment({
              agent_address: agentId,
              wallet_address: publicKey?.toString() || "",
              timestamp: Date.now(),
            });
          }
    
          await coinApiClient.sendMessage({
            message_id: selectedMessageId,
            message: comment,
            agent_id: agentId,
            is_reply: !!selectedMessageId,
          });
    
          toast({
            title: "Success",
            description: "Your message is added!",
            status: "success",
            position: "bottom-right",
          });
          const agentReply =  {
            created_by: profile?.profile?.username,
            user_details: {
              profile_pic: agentImage,
              public_key: "key2",
              username: agentName ??"Test"
            },
            message_id: selectedMessageId,
            timestamp: Date.now().toString(),
            image: agentImage,
            message: "Agent is Typing ...",
            is_reply: selectedMessageId ? true : false,
            is_agent: true,
          };

          if (selectedMessageId) {            
            const userReply =  {
              created_by: profile?.profile?.username,
              user_details: {
                profile_pic: profile?.profile?.profile_pic,
                public_key: "key2",
                username: profile?.profile?.username
              },
              message_id: selectedMessageId,
              timestamp: Date.now().toString(),
              image: profile?.profile?.profile_pic,
              message: value,
              is_reply: selectedMessageId ? true : false,
              is_agent: false,
            };
            const updatedChats = addReplyToChat(chats, selectedMessageId, userReply);
            // const updatedChatsWithAgent = addReplyToChat(updatedChats, selectedMessageId, agentReply);
            setChats(updatedChats);
          } else {
            const newChat = {
              created_by: profile?.profile?.username,
              user_details: {
                profile_pic: profile?.profile?.profile_pic,
                public_key: "key2",
                username: profile?.profile?.username
              },
              message_id: "insertedMessage",
              timestamp: Date.now().toString(),
              image: profile?.profile?.profile_pic,
              message: value,
              is_reply: false,
              is_agent: false,
              replies: [],
            }
            setChats([...chats, newChat]);
          }
          setValue("");
          onSubmit();
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
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />
            <Button
                bg="white"
                fontSize="12px"
                color="black"
                borderRadius="0"
                disabled={!isAuthenticated || posting}
                onClick={() => {
                    // onSubmit();
                    handleSubmit();
                }}
                opacity={posting ? 0.7 : 1}
            >
                {posting ? "POSTING..." : "POST"}
            </Button>
        </Box>
    );
};
export default AddCommentUpdated