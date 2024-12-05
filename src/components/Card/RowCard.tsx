import {
  Box,
  Heading,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableProps,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

import CreatedAtComponent from "../Created";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

interface CardProps {
  id: string;
  image: string;
  ticker: string;
  name: string;
  description: string;
  created_at: string | number;
  created_by: string;
  market_cap: string;
  fee_basis_points: string;
  replies: string;
  twenty_four_hr_changes?: number;
  holder?: number;
}

function DataTable({ feed }: { feed: CardProps[] }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const isMediumScreen = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  });
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedFeed = [...feed].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn as keyof CardProps];
    const valueB = b[sortColumn as keyof CardProps];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
    return 0;
  });

  // const getSortArrow = (column: string) =>
  //   sortColumn === column ? (
  //     sortOrder === "asc" ? (
  //       <IoIosArrowRoundUp cursor="pointer" size={20} />
  //     ) : (
  //       <IoIosArrowRoundDown cursor="pointer" size={20} />
  //     )
  //   ) : (
  //     <IoIosArrowRoundUp cursor="pointer" size={20} />
  //   );

  const getSortArrow = (column: string) => null

  const getTableProps = (): TableProps => ({
    variant: "unstyled",
    size: isSmallScreen ? "sm" : "md",
    sx: {
      borderCollapse: "separate",
      borderSpacing: isSmallScreen ? "0 10px" : "0 20px",
      padding: isSmallScreen ? "0 10px" : "0 20px",
    },
  });

  return (
    <VStack bg="#1B1B1E" width="100%" overflowX="auto" spacing={0}>
      <TableContainer width="100%">
        <Table {...getTableProps()}>
          <Thead>
            <Tr padding="20px">
              <Th
                color="#656565"
                textAlign="left"
                onClick={() => handleSort("ticker")}
                cursor="pointer"
              >
                <Box display="flex" alignItems="center" gap="10px">
                  Ticker {getSortArrow("ticker")}
                </Box>
              </Th>

              <Th
                color="#656565"
                textAlign="right"
                onClick={() => handleSort("created_by")}
                cursor="pointer"
                paddingRight={isSmallScreen ? "0.5rem" : "1rem"}
              >
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  gap="10px"
                >
                  Creator {getSortArrow("created_by")}
                </Box>
              </Th>

              {isLargeScreen && (
                <>
                  <Th
                    color="#656565"
                    textAlign="right"
                    onClick={() => handleSort("created_at")}
                    cursor="pointer"
                    paddingRight={isSmallScreen ? "0.5rem" : "1rem"}
                  >
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                      gap="10px"
                    >
                      Created {getSortArrow("created_at")}
                    </Box>
                  </Th>
                  <Th
                    color="#656565"
                    textAlign="right"
                    onClick={() => handleSort("market_cap")}
                    cursor="pointer"
                    paddingRight={isSmallScreen ? "0.5rem" : "1rem"}
                  >
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                      gap="10px"
                    >
                      MCAP {getSortArrow("market_cap")}
                    </Box>
                  </Th>
                  <Th
                    color="#656565"
                    textAlign="right"
                    onClick={() => handleSort("holder")}
                    cursor="pointer"
                    paddingRight={isSmallScreen ? "0.5rem" : "1rem"}
                  >
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                      gap="10px"
                    >
                      Holders {getSortArrow("holder")}
                    </Box>
                  </Th>
                  <Th
                    color="#656565"
                    textAlign="right"
                    onClick={() => handleSort("replies")}
                    cursor="pointer"
                    paddingRight={isSmallScreen ? "0.5rem" : "1rem"}
                  >
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                      gap="10px"
                    >
                      Comments {getSortArrow("replies")}
                    </Box>
                  </Th>
                </>
              )}

              {!isLargeScreen && <Th
                color="#656565"
                textAlign="right"
                onClick={() => handleSort("market_cap")}
                cursor="pointer"
                paddingRight={isSmallScreen ? "0.5rem" : "1rem"}
              >
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  gap="10px"
                >
                  MCAP {getSortArrow("market_cap")}
                </Box>
              </Th>}
            </Tr>
          </Thead>
          <Tbody>
            {sortedFeed.map((data: CardProps) =>
              parseFloat(data.market_cap) >= 0 ? (
                <Tr
                  key={data.id}
                  bg={isHovered === data.id ? "#2D2D2D" : "transparent"}
                  cursor="pointer"
                  onClick={() => router.push(`/${data.id}`)}
                  onMouseEnter={() => setIsHovered(data.id)}
                  onMouseLeave={() => setIsHovered("")}
                >
                  <Td
                    borderLeft="1px solid #343434"
                    borderTop="1px solid #343434"
                    borderBottom="1px solid #343434"
                    p={isSmallScreen ? "0.8rem" : "1.5rem"}
                  >
                    <HStack
                      spacing={isSmallScreen ? "0.5rem" : "1rem"}
                      alignItems={isSmallScreen ? "flex-start" : "center"}
                    >
                      <Image
                        boxSize={isSmallScreen ? "2rem" : "4rem"}
                        objectFit="cover"
                        src={data.image}
                        alt="Ticker Image"
                      />
                      <VStack alignItems="flex-start" spacing="0">
                        <Heading
                          as="h4"
                          size="sm"
                          fontSize={isSmallScreen ? "14px" : "16px"}
                          color="white"
                        >
                          ${data.ticker}
                        </Heading>
                        <Text
                          fontSize={isSmallScreen ? "10px" : "12px"}
                          wordBreak="break-all"
                        >
                          {data.name}
                        </Text>
                        {!isSmallScreen && (
                          <Text
                            fontSize="12px"
                            color="gray.500"
                            maxWidth="200px"
                            overflow="hidden"
                            wordBreak="break-all"
                          >
                            {data.description.slice(0, 20)}...
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Td>

                  <Td
                    textAlign="right"
                    color="#00C2FF"
                    borderTop="1px solid #343434"
                    borderBottom="1px solid #343434"
                    fontSize={isLargeScreen ? "14px" : "12px"}
                  >
                    {data.created_by}
                  </Td>

                  {isLargeScreen && (
                    <>
                      <Td
                        textAlign="right"
                        color="white"
                        borderTop="1px solid #343434"
                        borderBottom="1px solid #343434"
                      >
                        <CreatedAtComponent
                          timeStamp={parseInt(data.created_at.toString())}
                          noHeader
                        />
                      </Td>
                      <Td
                        textAlign="right"
                        color="white"
                        borderTop="1px solid #343434"
                        borderBottom="1px solid #343434"
                        fontSize="16px"
                      >
                        ${data.market_cap}
                      </Td>
                      <Td
                        textAlign="right"
                        color="white"
                        borderTop="1px solid #343434"
                        borderBottom="1px solid #343434"
                      >
                        {data.holder}
                      </Td>
                      <Td
                        textAlign="right"
                        color="white"
                        borderTop="1px solid #343434"
                        borderBottom="1px solid #343434"
                        borderRight="1px solid #343434"
                      >
                        {data.replies}
                      </Td>
                    </>
                  )}

                  {!isLargeScreen &&
                    <Td
                      textAlign="right"
                      color="white"
                      borderTop="1px solid #343434"
                      borderBottom="1px solid #343434"
                      fontSize="12px"
                      borderRight="1px solid #343434"
                    >
                      ${data.market_cap}
                    </Td>
                  }
                </Tr>
              ) : null
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}

export default DataTable;
