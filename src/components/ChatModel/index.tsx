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
import React from "react";

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
        <ModalBody>
          <Stack>
            <Text>Comment</Text>
            <Textarea
              backgroundColor="grey.100"
              border={0}
              focusBorderColor="grey.50"
              width="30vw"
              height="20vh"
              onChange={(e) => props.onChangeMessage(e.target.value)}
            />
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={props.isLoading}
            fontSize="12px"
            fontWeight="bold"
            onClick={props.onSubmit}
          >
            Post Comment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default ChatModelComponent;
