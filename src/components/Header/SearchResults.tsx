import { homeApiClient } from '@/modules/Home/services/homeApiClient';
import useDebounce from '@/utils/useDebounce';
import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

function SearchResults({ searchText }: { searchText: string}) {

    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(searchText, 1000);
    const [feed, setFeed] = useState<any>([]);

    const fetchFeed = async () => {
        try {
          setLoading(true);
          let resp = [];
          if (searchText !== "") {
            const searchRes = await homeApiClient.searchFeed(searchText);
            if (searchRes.agents.length > 0) {
              resp = searchRes.agents;
              setFeed(resp);
            } 
          }
          setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        debouncedQuery !== "" && fetchFeed()
    }, [debouncedQuery])

    if (searchText === "") {
        return null;
    }

    return (
        <VStack position="absolute" maxHeight="250px" overflowY="auto" top="100%" left="0" width="100%" display="flex" flexDirection="column" gap="10px" p="4" zIndex="100" bg="linear-gradient(100deg, #571F0D -0.99%, #5E220F 64.54%, #642410 112.46%)">
            {feed.map((data: any) => (
                <HStack p="2" border="1px solid white" justifyContent="space-between" width="100%">
                    <Image
                        boxSize="1rem"
                        objectFit="cover"
                        src={data.image}
                        alt="Ticker Image"
                    />
                    <VStack>
                        <Text>${data.ticker}</Text>
                    </VStack>
                </HStack>
            ))}
        </VStack>
    )
}

export default SearchResults