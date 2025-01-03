import { Box, Button, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { homeApiClient } from "@/modules/Home/services/homeApiClient";
import useUserStore from "@/stores/useUserStore";

import { TimeLogo } from "../Svgs/TimeLogo";
import { TimeLogoDown } from "../Svgs/TimeLogoDown";

function TimerScreen() {
  const [verifying, setVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
  });

  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const { isAuthenticated, profile } = useUserStore();
  const [launched, setLaunched] = useState(false);

  const handleVerifyNFT = async () => {
    if (!isAuthenticated) {
      setError({
        error: true,
        message: "Please connect your wallet first",
      });
      return;
    }
    setVerifying(true);

    try {
      const data = await homeApiClient.verifyNft({
        userAddress: profile?.profile?.address,
      });
      if (!data.success) {
        setError({
          error: true,
          message: "NFT is not verified!",
        });
      } else {
        setError({
          error: false,
          message: "Congrats! Your NFT is verified!",
        });
      }
    } catch (e) {
      setError({
        error: true,
        message: "Unable to verify!",
      });
      console.error(e);
    }
    setVerifying(false);
  };

  useEffect(() => {
    const targetDate: any = new Date("2024-11-29T22:00:00");
    const calculateTimeLeft = () => {
      const now: any = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setLaunched(true);
        return { hours: 0, minutes: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    const countdownInterval = setInterval(updateTimer, 60000); // Update every minute
    updateTimer(); // Initialize the timer immediately

    return () => clearInterval(countdownInterval);
  }, []);

  if (launched) {
    return null;
  }
  return (
    <Box
      width="100%"
      bg="#FDC912"
      minWidth="200px"
      height="300px"
      mt="40px"
      overflow="hidden"
      position="relative"
      color="black"
    >
      <Box
        position="absolute"
        left="-50"
        display={{ md: "block", base: "none" }}
      >
        <TimeLogo />
      </Box>
      <Box
        position="absolute"
        bottom="0"
        right="20"
        display={{ md: "block", base: "none" }}
      >
        <TimeLogoDown />
      </Box>
      <VStack width="100%" height="100%" alignItems="center" p="2rem">
        <Text fontSize="15px" className="knf">
          Alpha mode access ends in
        </Text>
        <HStack flexGrow="1" gap="20px">
          <Box border="1px solid black" display="flex" p="1rem">
            <Text fontSize={{ base: "18px", sm: "32px" }}>
              {String(timeLeft.hours).padStart(2, "0")[0]}
            </Text>
          </Box>
          <Box border="1px solid black" display="flex" p="1rem">
            <Text fontSize={{ base: "18px", sm: "32px" }}>
              {String(timeLeft.hours).padStart(2, "0")[1]}
            </Text>
          </Box>
          <Text>:</Text>
          <Box border="1px solid black" display="flex" p="1rem">
            <Text fontSize={{ base: "18px", sm: "32px" }}>
              {String(timeLeft.minutes).padStart(2, "0")[0]}
            </Text>
          </Box>
          <Box border="1px solid black" display="flex" p="1rem">
            <Text fontSize={{ base: "18px", sm: "32px" }}>
              {String(timeLeft.minutes).padStart(2, "0")[1]}
            </Text>
          </Box>
        </HStack>
        <Text textAlign="center">
          Early access & 20% for a month <br />
          for NFT holders.
        </Text>
        <Button
          onClick={handleVerifyNFT}
          display="flex"
          alignItems="center"
          gap="10px"
          disabled={verifying}
          opacity={verifying ? 0.8 : 1}
        >
          {verifying && <Spinner size="sm" />} <span>Verify NFT</span>
        </Button>
        {error.message !== "" && (
          <Text color={error.error ? "red.500" : "green"} fontSize="12px">
            {error.message}
          </Text>
        )}
      </VStack>
    </Box>
  );
}

export default TimerScreen;
