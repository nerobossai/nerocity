import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";

import { authApiClient } from "../Home/services/authApiClient";

function ReferralModule() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const validateReferralCode = async () => {
    try {
      setLoading(true);
      const isValid = await authApiClient.validateReferral({
        code: otp,
      });

      if (!isValid) {
        throw new Error("invalid code");
      }

      localStorage.setItem("isr", "true");

      toast({
        title: "Congratulations 🎉",
        description: "Valid Referral Code",
        status: "success",
        position: "bottom-right",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid Referral Code",
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isReferred = localStorage.getItem("isr");
    if (isReferred === "true") return;
    onOpen();
  }, []);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        backgroundColor="grey.50"
        color="white"
        justifyContent="center"
        alignItems="center"
        borderWidth="1px"
        textAlign="center"
        minWidth="40vw"
      >
        <ModalHeader>
          Do you have a referral code ? <br />
          (Join Martian’s Telegram community to get one)
        </ModalHeader>
        <ModalBody>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={5}
            renderSeparator={<span />}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              margin: "0.3rem",
              height: "5vw",
              backgroundColor: "#D9D9D9",
              borderRadius: "0.3rem",
              width: "5vw",
              minWidth: "30px",
              minHeight: "30px",
              color: "black",
              fontWeight: "bold",
            }}
          />
        </ModalBody>

        <ModalFooter width="100%">
          <Button
            width="100%"
            isLoading={loading}
            onClick={validateReferralCode}
          >
            Enter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReferralModule;
