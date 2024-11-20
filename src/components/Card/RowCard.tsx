import { Box, HStack, Stack, Image, VStack, Heading, Text, Grid } from '@chakra-ui/react'
import React from 'react'
import { CardProps } from './index'
import { timeDifference } from '@/utils/timeDifference'

function RowCard(props: CardProps) {
    return (
        <Stack padding="20px" width="100%"  marginTop="20px" border="1px solid #343434" bg="#1B1B1E" display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="center">
            <HStack
                className="card-main"
                justifyContent="start"
                alignItems="start"
                spacing="1rem"
                gap="1rem"
            >
                <Image
                    boxSize="6rem"
                    objectFit="cover"
                    src={props.image}
                    alt="ai agent image"
                />
                <VStack textAlign="left" alignItems="start">
                    <Heading as='h4' size='md' fontSize="16px">
                        {props.ticker}
                    </Heading>
                    <Heading as="h5" size="sm" textAlign="left">
                        {props.name}
                    </Heading>
                    <Text fontSize="12px" fontWeight="bold" color="text.100">
                        {props.description}
                    </Text>
                </VStack>

            </HStack>
            <Grid templateColumns={{
                base: 'repeat(2, 1fr)',   // 2 columns for small screens
                md: 'repeat(3, 1fr)',     // 3 columns for medium screens
                lg: 'repeat(6, 1fr)',     // 6 columns for large screens
            }}
            textTransform="uppercase"
                gap="2rem">
                <VStack alignItems="flex-end">
                    <Text fontSize="12px" color="text.100">
                        CREATED
                    </Text>
                    <Text fontSize="14px">
                        {timeDifference(
                            Date.now(),
                            parseInt(props.created_at.toString(), 10),
                        )}
                    </Text>
                </VStack>
                <VStack alignItems="flex-end">
                    <Text fontSize="12px" color="text.100">
                        CREATOR
                    </Text>
                    <Text fontSize="14px" color="#00C2FF">
                        {props.created_by}
                    </Text>
                </VStack>
                <VStack alignItems="flex-end">
                    <Text fontSize="12px" color="text.100">
                        MCAP
                    </Text>
                    <Text fontSize="14px">
                        {props.market_cap}
                    </Text>
                </VStack>
                <VStack alignItems="flex-end">
                    <Text fontSize="12px" color="text.100">
                        HOLDERS
                    </Text>
                    <Text fontSize="14px">
                        {props.fee_basis_points}
                    </Text>
                </VStack>
                <VStack alignItems="flex-end">
                    <Text fontSize="12px" color="text.100">
                        COMMENTS
                    </Text>
                    <Text fontSize="14px">
                        {props.replies}
                    </Text>
                </VStack>
                <VStack alignItems="flex-end">
                    <Text fontSize="12px" color="text.100">
                        24H
                    </Text>
                    <Text fontSize="14px" color="green.100">
                        120%
                    </Text>
                </VStack>
            </Grid>
        </Stack>
    )
}

export default RowCard