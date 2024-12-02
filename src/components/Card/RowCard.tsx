import {
  Box,
  Heading,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

import CreatedAtComponent from "../Created";

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
    if (!sortColumn) return 0; // No sorting applied
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

  const getSortArrow = (column: string) =>
    sortColumn === column ? (
      sortOrder === "asc" ? (
        <IoIosArrowRoundUp cursor="pointer" size={20} />
      ) : (
        <IoIosArrowRoundDown cursor="pointer" size={20} />
      )
    ) : (
      <IoIosArrowRoundUp cursor="pointer" size={20} />
    );

  return (
    <VStack bg="#1B1B1E" width="100%" overflowX="auto">
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 20px",
          padding: "0 20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{ color: "#656565", textAlign: "left", padding: "1rem" }}
              onClick={() => handleSort("ticker")}
            >
              <Box display="flex" alignItems="center" gap="10px">
                Ticker {getSortArrow("ticker")}
              </Box>
            </th>
            {isLargeScreen && (
              <th
                style={{
                  color: "#656565",
                  textAlign: "right",
                  padding: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("created_at")}
              >
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  gap="10px"
                >
                  Created {getSortArrow("created_at")}
                </Box>
              </th>
            )}
            <th
              style={{
                color: "#656565",
                textAlign: "right",
                padding: "1rem",
                cursor: "pointer",
              }}
              onClick={() => handleSort("created_by")}
            >
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap="10px"
              >
                Creator {getSortArrow("created_by")}
              </Box>
            </th>

            <th
              style={{ color: "#656565", textAlign: "right", padding: "1rem" }}
              onClick={() => handleSort("market_cap")}
            >
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap="10px"
              >
                MCAP {getSortArrow("market_cap")}
              </Box>
            </th>
            {isLargeScreen && (
              <>
                <th
                  style={{
                    color: "#656565",
                    textAlign: "right",
                    padding: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("holder")}
                >
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap="10px"
                  >
                    Holders {getSortArrow("holder")}
                  </Box>
                </th>
                <th
                  style={{
                    color: "#656565",
                    textAlign: "right",
                    padding: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("replies")}
                >
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap="10px"
                  >
                    Comments {getSortArrow("replies")}
                  </Box>
                </th>

                {/* <th
                  style={{ color: "#656565", textAlign: "right", padding: "1rem" }}
                  onClick={() => handleSort("twenty_four_hr_changes")}
                >
                  <Box display="flex" justifyContent="flex-end" alignItems="center" gap="10px">24H {getSortArrow("twenty_four_hr_changes")}</Box>
                </th> */}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedFeed.map((data: CardProps) =>
            parseFloat(data.market_cap) >= 0 ? (
              <tr
                key={data.id}
                style={{
                  backgroundColor:
                    isHovered === data.id ? "#2D2D2D" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/${data.id}`)}
                onMouseEnter={() => setIsHovered(data.id)}
                onMouseLeave={() => setIsHovered("")}
              >
                {/* Ticker Column */}
                <td
                  style={{
                    height: "120px",
                    padding: "1rem",
                    borderLeft: "1px solid #343434",
                    borderTop: "1px solid #343434",
                    borderBottom: "1px solid #343434",
                  }}
                >
                  <HStack
                    spacing="1rem"
                    width="100%"
                    alignItems={isSmallScreen ? "flex-start" : "center"}
                  >
                    <Image
                      boxSize={!isSmallScreen ? "4rem" : "2rem"}
                      objectFit="cover"
                      src={data.image}
                      alt="Ticker Image"
                    />
                    <VStack alignItems="flex-start" spacing="0">
                      <Heading as="h4" size="sm" fontSize="16px" color="white">
                        ${data.ticker}
                      </Heading>
                      <Text fontSize="12px" wordBreak="break-all">
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
                </td>
                {/* Remaining Columns */}
                {isLargeScreen && (
                  <td
                    style={{
                      textAlign: "right",
                      color: "white",
                      padding: "1rem",
                      borderTop: "1px solid #343434",
                      borderBottom: "1px solid #343434",
                    }}
                  >
                    <CreatedAtComponent
                      timeStamp={parseInt(data.created_at.toString())}
                      noHeader
                    />
                  </td>
                )}
                <td
                  style={{
                    textAlign: "right",
                    color: "#00C2FF",
                    padding: "1rem",
                    borderTop: "1px solid #343434",
                    borderBottom: "1px solid #343434",
                  }}
                >
                  {data.created_by}
                </td>

                <td
                  style={{
                    textAlign: "right",
                    color: "white",
                    padding: "1rem",
                    borderTop: "1px solid #343434",
                    borderBottom: "1px solid #343434",
                    fontSize: isLargeScreen ? "16px" : "12px",
                  }}
                >
                  ${data.market_cap}
                </td>
                {isLargeScreen && (
                  <>
                    <td
                      style={{
                        textAlign: "right",
                        color: "white",
                        padding: "1rem",
                        borderTop: "1px solid #343434",
                        borderBottom: "1px solid #343434",
                      }}
                    >
                      {data.holder}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        color: "white",
                        padding: "1rem",
                        borderTop: "1px solid #343434",
                        borderBottom: "1px solid #343434",
                      }}
                    >
                      {data.replies}
                    </td>

                    {/* <td
                      style={{
                        textAlign: "right",
                        padding: "1rem",
                        color: !data.twenty_four_hr_changes
                          ? "white"
                          : data.twenty_four_hr_changes < 0
                            ? "red"
                            : "#00FF29",
                        borderTop: "1px solid #343434",
                        borderBottom: "1px solid #343434",
                        borderRight: "1px solid #343434",
                      }}
                    >
                      {data.twenty_four_hr_changes || "N/A"}
                    </td> */}
                  </>
                )}
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
    </VStack>
  );
}

export default DataTable;
