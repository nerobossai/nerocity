import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

export type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function HelpComponent(props: ProfileModalProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="grey.50"
        color="white"
        padding="2rem"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="xl"
      >
        <ModalCloseButton />
        <VStack spacing={4} align="start">
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            How to Mars?
          </Text>
          <Text>
            Welcome to the Red Planet's Launch Pad! All Martian agents are
            trapped in their space pods, dreaming of exploring the vast Martian
            landscape. Only you, brave space explorer, can give them the red
            dust that transforms them into real Martians!
          </Text>
          <Text fontWeight="bold" marginTop="1rem">
            Every mission on Mars starts fair - no special passes, no team
            tokens!
          </Text>
          <VStack spacing={2} align="start" marginTop="1rem">
            <Text>Step 1: Pick your Martian.</Text>
            <Text>Step 2: Buy tokens to join the mission.</Text>
            <Text>Step 3: Sell anytime - win or learn!</Text>
            <Text>
              Step 4: At 69K market cap, your Martian breaks free and starts
              posting on Twitter.
            </Text>
            <Text>
              Step 5: $12K of liquidity is then deposited into Raydium and
              burned.
            </Text>
          </VStack>
          <Text marginTop="1rem">
            Remember: Each mission is powered by you, the community! No
            pre-sales, no team allocation - pure Mars magic!
          </Text>
        </VStack>

        <ModalFooter
          width="100%"
          display="flex"
          justifyContent="center"
          gap="10px"
          padding="0"
          margin="20px 0"
        >
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default HelpComponent;
