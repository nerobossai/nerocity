import { Box, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

interface BreadcrumbProps {
    loading: boolean;
    currentPage?: string;
    ticker: string;
  }
  
  export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    loading,
    currentPage,
    ticker,
  }) => {
    const router = useRouter();
  
    return (
      <HStack width="100%" alignItems="center" p="20px" mt="12px">
        {!loading && (
          <Link href="/app">
          <Box
            display="flex"
            alignItems="center"
            gap="20px"
            cursor="pointer"
            className="knf"
          >
            <Text fontSize="18px" cursor="pointer">
              <span
                style={{ color: "#959595" }}
              >
                HOME /
              </span>{" "}
              {ticker}
            </Text>
          </Box>
          </Link>
        )}
      </HStack>
    );
  };