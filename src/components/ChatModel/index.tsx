import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Turnstile } from "@marsidev/react-turnstile";
import React from "react";

import { cloudflareCommentsSitekey } from "@/constants/storageKeys";

export type ChatModelProps = {
  isOpen: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  onChangeMessage: (data: any) => void;
  onClose: () => void;
};

function ChatModelComponent(props: ChatModelProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <Turnstile
        onSuccess={(token) => {
          localStorage.setItem("cloudflare-comments-token", token);
        }}
        siteKey={cloudflareCommentsSitekey}
      />
      <ModalOverlay />
      <ModalContent
        backgroundColor="grey.50"
        color="white"
        justifyContent="center"
        alignItems="center"
        borderWidth="1px"
      >
        <ModalHeader>Add a comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody width="95%">
          <Stack>
            <Text>Comment</Text>
            <Textarea
              backgroundColor="grey.100"
              border={0}
              focusBorderColor="grey.50"
              width="100%"
              minHeight="20vh"
              onChange={(e) => props.onChangeMessage(e.target.value)}
            />
          </Stack>
        </ModalBody>

        <ModalFooter width="70%" margin="15px">
          <Button
            isLoading={props.isLoading}
            fontSize="12px"
            fontWeight="bold"
            onClick={props.onSubmit}
            width="100%"
          >
            Post Comment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default ChatModelComponent;
