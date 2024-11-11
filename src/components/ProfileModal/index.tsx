import {
  Avatar,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

export type ProfileModalProps = {
  userDetails: any;
  isOpen: boolean;
  onClose: () => void;
  disconnect: () => void;
  isDisconnecting: boolean;
};

function ProfileModalComponent(props: ProfileModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="grey.50"
        color="white"
        padding="2rem"
        borderWidth="1px"
      >
        <ModalCloseButton />
        <VStack alignItems="flex-start" gap="10px">
          <Avatar boxSize="30px" src={props.userDetails?.profile_pic} />
          <Text>Wallet Address</Text>
          <Text fontSize="10px" wordBreak="break-all">
            {props.userDetails?.public_key}
          </Text>
        </VStack>
        <ModalFooter
          width="100%"
          display="flex"
          gap="10px"
          padding="0"
          margin="20px 0"
        >
          <Button
            fontSize="12px"
            fontWeight="bold"
            onClick={() => {
              router.push(`/profile/${props.userDetails?.username}`);
            }}
            width="100%"
            colorScheme="blue"
            flex="1"
          >
            Visit Profile
          </Button>
          <Button
            fontSize="12px"
            fontWeight="bold"
            onClick={() => props.disconnect()}
            width="100%"
            backgroundColor="primary"
            flex="1"
            isLoading={props.isDisconnecting}
            loadingText="Disconnecting..."
          >
            {props?.isDisconnecting ? <Spinner size="sm" /> : "Disconnect"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default ProfileModalComponent;
