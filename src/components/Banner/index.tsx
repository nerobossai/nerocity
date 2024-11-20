import { Box, HStack } from '@chakra-ui/react'
import React from 'react'

function Banner() {
  return (
    <HStack height="40px" justifyContent="center" fontSize="12px" py="10px" overflow="hidden" bg="green.400" display="flex" gap="20px">
        <Box color="green.100">
            +12.12 SOL OF TICKER BOUGHT
        </Box>
        <Box color="#FF3838">
            +12.12 SOL OF TICKER SOLD
        </Box>
        <Box color="green.100">
            +12.12 SOL OF TICKER BOUGHT
        </Box>
        <Box color="#FF3838">
            -12.12 SOL OF TICKER SOLD
        </Box>
        
    </HStack>
  )
}

export default Banner