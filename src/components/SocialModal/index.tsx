import { coinApiClient } from "@/modules/Coin/services/coinApiClient";
import { profileApiClient } from "@/modules/Profile/services/profileApiClient";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { RiTwitterXFill } from "react-icons/ri";

export type SocialModalProps = {
  isOpen: boolean;
  data: any;
  name: string;
  setSelectedSocial: any;
  onClose: any;
};

function SocialModalComponent(props: SocialModalProps) {
  const toast = useToast();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  const startPolling = async (count = 0) => {
    const data = await coinApiClient.getAgent(props.data.mint_public_key);

    if (
      count === 10 &&
      data.social?.[props.name as "twitter" | "telegram"] === ""
    ) {
      toast({
        title: "Error",
        description: "unable to connect",
        status: "error",
        position: "bottom-right",
      });
      return;
    }

    if (data.social?.[props.name as "twitter" | "telegram"] === "") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      count += 1;
      await startPolling(count);
    } else {
      props.setSelectedSocial(data);
    }
  };

  const connectTwitter = async () => {
    try {
      setLoading(true);
      const { authUrl } = await profileApiClient.getLinkTwitterUrl(
        props.data.mint_public_key
      );
      window.open(authUrl, "_blank");

      // start polling
      await startPolling();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(connected, publicKey?.toString());
  }, [props.isOpen]);

  const handleConnect = () => {
    try {
      switch (props.name) {
        case "twitter": {
          connectTwitter();
          break;
        }
        default: {
          toast({
            title: "Coming Soon",
            description: "This functionality will be available soon.",
            status: "info",
            containerStyle: {
              backgroundColor: "blue"
            },
            position: "bottom-right",
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        position: "bottom-right",
      });
    }
  };

  const handleVisit = () => {
    const link = props.data?.social?.[props.name];
    switch (props.name) {
      case "twitter": {
        window.open(`https://x.com/${link}`);
        break;
      }
      default: {
        window.open(link);
      }
    }
  };

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
        <ModalHeader textTransform={"capitalize"}>{props.name}</ModalHeader>
        <ModalCloseButton onClick={props.onClose} />
        <ModalBody width={"100%"}>
          <HStack justifyContent={"center"}>
            <Text marginRight={"1rem"}>Status:</Text>
            <Text
              color={props.data?.social?.[props.name] !== "" ? "green" : "red"}
            >
              {props.data?.social?.[props.name] !== ""
                ? "Connected"
                : "Not Connected"}
            </Text>
          </HStack>
        </ModalBody>
        <ModalFooter>
          {props?.data?.user_details?.address !== publicKey?.toString() ? (
            <Button
              _hover={{
                opacity: 0.8,
              }}
              width="100%"
              isDisabled={props.data?.social?.[props.name] === ""}
              display="flex"
              justifyContent="center"
              gap="10px"
              onClick={handleVisit}
            >
              Visit
            </Button>
          ) : (
            <Button
              _hover={{
                opacity: 0.8,
              }}
              width="100%"
              isLoading={loading}
              isDisabled={loading}
              display="flex"
              justifyContent="center"
              gap="10px"
              onClick={
                props.data?.social?.[props.name] !== ""
                  ? handleVisit
                  : handleConnect
              }
            >
              {props.data?.social?.[props.name] !== "" ? (
                "Visit"
              ) : (
                <>
                  {props.name === "twitter" ? (
                    <>
                      <RiTwitterXFill size="15px" />
                      <span>Connect Twitter</span>
                    </>
                  ) : (
                    <span>Connect</span>
                  )}
                </>
              )}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default SocialModalComponent;
