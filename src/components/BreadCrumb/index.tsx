import { Box, HStack, Text } from "@chakra-ui/react";
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
        <Box
          display="flex"
          alignItems="center"
          gap="20px"
          cursor="pointer"
          onClick={() => router.push("/app")}
          className="knf"
        >
          <Text fontSize="18px" cursor="pointer">
            <span
              style={{ color: "#959595" }}
              onClick={() => router.push("/app")}
            >
              HOME /
            </span>{" "}
            {ticker}
          </Text>
        </Box>
      )}
    </HStack>
  );
};
