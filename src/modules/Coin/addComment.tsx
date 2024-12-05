import { Box, Button, Textarea, useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { trackComment, trackReply } from "./services/analytics";
import { coinApiClient } from './services/coinApiClient';

const AddCommentUpdated = ({
    comment,
    setComment,
    isAuthenticated,
    onSubmit,
    onFocus,
    onBlur,
    selectedMessageId,
    agentId,
    publicKey
}: any) => {
    const [value, setValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [posting, setPosting] = useState(false);
    const toast = useToast();

    const adjustHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
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
        if (value.trim() === "") return;
        try {
            setPosting(true);
            const resp = await coinApiClient.sendMessage({
                message_id: selectedMessageId,
                message: comment,
                agent_id: agentId,
                is_reply: !!selectedMessageId,
            });
            console.log("comments added response", resp);
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
            toast({
                title: "Success",
                description: "Added your message!",
                status: "success",
                position: "bottom-right",
            });
            setValue("");
            onSubmit(true);
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
                {isAuthenticated ? (posting ? "POSTING..." : "POST") : "CONNECT WALLET"}
            </Button>
        </Box>
    );
};
export default AddCommentUpdated