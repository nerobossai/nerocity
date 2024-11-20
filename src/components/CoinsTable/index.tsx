import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import MainCard from '../Card/MainCard';
import RowCard from '../Card/RowCard';

function CoinsTable({feed}: any) {
  return (
    <VStack width="100%" gap="1rem" marginTop="20px">
        <HStack justifyContent="space-between" width="100%">
            <Text className="knf" fontSize="18px">{feed.length} AGENTS LIVE</Text>
            <HStack gap="0.5rem">
                <Button padding="4px" fontSize="14px" bg="white" color="black">
                    All
                </Button>
                <Button padding="4px" fontSize="14px" bg="#1B1B1E" color="text.100">
                    Gainers
                </Button>
                <Button padding="4px" fontSize="14px" bg="#1B1B1E" color="text.100">
                    Losers
                </Button>
                <Button padding="4px" fontSize="14px" bg="#1B1B1E" color="text.100">
                    Migrated
                </Button>
            </HStack>
        </HStack>

        <VStack bg="#1B1B1E" padding="2rem">
        {feed.map((data: any) => {
                return parseFloat(data.market_cap) >= 0 ? (
                  <RowCard {...data} key={data.id} />
                ) : null;
              })}
        </VStack>
    </VStack>
  )
}

export default CoinsTable