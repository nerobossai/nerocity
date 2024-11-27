import React, { useEffect, useState } from 'react';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { TimeLogo } from '../Svgs/TimeLogo';
import { TimeLogoDown } from '../Svgs/TimeLogoDown';
import useUserStore from '@/stores/useUserStore';
import { homeApiClient } from '@/modules/Home/services/homeApiClient';

function TimerScreen() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 0,
    });

    const [error, setError] = useState({
        error: false,
        message: ""
    });

    const { isAuthenticated, profile } = useUserStore();
    const handleVerifyNFT = async () => {
        if (!isAuthenticated) {
            setError({
                error: true,
                message: "Please connect your wallet first"
            });
            return;
        }

        try {
            const data = await homeApiClient.verifyNft({ userAddress: profile?.profile?.address });
            if (!data.success) {
                setError({
                    error: true,
                    message: "NFT is not verified"
                });
            } else {
                setError({
                    error: false,
                    message: "NFT is verified!"
                });
            }

        } catch (e) {
            setError({
                error: true,
                message: "Unable to verify!"
            });
            console.error(e);
        }
    }

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setTimeLeft((prevTime) => {
                const totalMinutes = prevTime.hours * 60 + prevTime.minutes - 1;
                if (totalMinutes <= 0) {
                    clearInterval(countdownInterval);
                    return { hours: 0, minutes: 0 };
                }
                const updatedHours = Math.floor(totalMinutes / 60);
                const updatedMinutes = totalMinutes % 60;
                return { hours: updatedHours, minutes: updatedMinutes };
            });
        }, 60000);

        return () => clearInterval(countdownInterval);
    }, []);

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
            <Box position="absolute" left="-50" display={{ md: 'block', base: 'none' }}>
                <TimeLogo />
            </Box>
            <Box position="absolute" bottom="0" right="20" display={{ md: 'block', base: 'none' }}>
                <TimeLogoDown />
            </Box>
            <VStack width="100%" height="100%" alignItems="center" p="2rem">
                <Text fontSize="15px" className="knf">
                    Launching In
                </Text>
                <HStack flexGrow="1" gap="20px">
                    <Box border="1px solid black" display="flex" p="1rem">
                        <Text fontSize={{ base: "18px", sm: "32px" }}>{String(timeLeft.hours).padStart(2, '0')[0]}</Text>
                    </Box>
                    <Box border="1px solid black" display="flex" p="1rem">
                        <Text fontSize={{ base: "18px", sm: "32px" }}>{String(timeLeft.hours).padStart(2, '0')[1]}</Text>
                    </Box>
                    <Text>:</Text>
                    <Box border="1px solid black" display="flex" p="1rem">
                        <Text fontSize={{ base: "18px", sm: "32px" }}>{String(timeLeft.minutes).padStart(2, '0')[0]}</Text>
                    </Box>
                    <Box border="1px solid black" display="flex" p="1rem">
                        <Text fontSize={{ base: "18px", sm: "32px" }}>{String(timeLeft.minutes).padStart(2, '0')[1]}</Text>
                    </Box>
                </HStack>
                <Text textAlign="center">
                    Early access & 20% for a month <br />
                    for NFT holders.
                </Text>
                <Button onClick={handleVerifyNFT}>
                    Verify NFT
                </Button>
                {
                    error.message !== "" &&
                    <Text color={error.error ? "red.500" : "green"} fontSize="12px">{error.message}</Text>
                }
            </VStack>
        </Box>
    );
}

export default TimerScreen;
