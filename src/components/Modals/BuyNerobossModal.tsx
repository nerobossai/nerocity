import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

const BuyNerobossModal = (props: any) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="rgba(44, 27, 17, 0.95)" color="white">
        <ModalHeader>Oops!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Not Enough $NEROBOSS, You Need 10000 $NEROBOSS To Launch Token
          </Text>
        </ModalBody>

        <ModalFooter>
          <a
            href="https://raydium.io/swap/?inputMint=sol&outputMint=5HTp1ebDeBcuRaP4J6cG3r4AffbP4dtcrsS7YYT7pump"
            target="_blank"
          >
            <Button color="white" bg="#571F0D" padding="0px 12px">
              BUY $NEROBOSS
            </Button>
          </a>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BuyNerobossModal;
