import { homeApiClient } from '@/modules/Home/services/homeApiClient';
import { timeDifference } from '@/utils/timeDifference';
import useDebounce from '@/utils/useDebounce';
import { Box, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function SearchResults({ searchText, setSearchText }: { searchText: string, setSearchText: (v: string) => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
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
            setLoading(false);
        }
    }

    useEffect(() => {
        debouncedQuery !== "" && fetchFeed()
    }, [debouncedQuery])

    if (searchText === "") {
        return null;
    }
    

    return (
        <VStack className="scrollbar" py="5px" position="absolute" mt="5px" border="1px solid #6F5034" maxHeight="250px" overflowY="auto" top="100%" left="0" width="100%" display="flex" flexDirection="column" gap="10px" p="4" zIndex="100" bg="brown.200">
            {loading ? <Box my="10px">
                <Spinner />
            </Box> : feed.length === 0 ? <Text>No results found!</Text> : feed.map((data: any) => (
                <HStack cursor="pointer" p="2" border="1px solid #959595" justifyContent="space-between" width="100%" color="secondary" fontSize="12px"
                    onClick={() => { setSearchText(""); router.push("/" + data.id); }}>
                    <HStack alignItems="center">

                        <Image
                            boxSize="2rem"
                            objectFit="cover"
                            src={data.image}
                            alt="Ticker Image"
                        />
                        <Text color="white" fontSize="14px">${data.ticker}</Text>
                    </HStack>
                    <Text color="white">${data.market_cap}</Text>
                    <Text>{timeDifference(
                        Date.now(),
                        parseInt(data.created_at.toString(), 10),
                    )}</Text>
                </HStack>
            ))}
        </VStack>
    )
}

export default SearchResults