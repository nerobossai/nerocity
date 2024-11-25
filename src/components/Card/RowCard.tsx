import {
  Heading,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

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
}

function DataTable({ feed }: { feed: CardProps[] }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState("");
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  return (
    <VStack bg="#1B1B1E" width="100%" overflowX="auto">
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 20px",
          padding: "0 20px", // Space between rows
        }}
      >
        <thead>
          <tr>
            <th
              style={{ color: "#656565", textAlign: "left", padding: "1rem" }}
            >
              Ticker
            </th>
            {isLargeScreen && (
              <>
                <th
                  style={{
                    color: "#656565",
                    textAlign: "right",
                    padding: "1rem",
                  }}
                >
                  Created
                </th>
                <th
                  style={{
                    color: "#656565",
                    textAlign: "right",
                    padding: "1rem",
                  }}
                >
                  Creator
                </th>
              </>
            )}
            <th
              style={{ color: "#656565", textAlign: "right", padding: "1rem" }}
            >
              MCAP
            </th>
            {isLargeScreen && (
              <>
                <th
                  style={{
                    color: "#656565",
                    textAlign: "right",
                    padding: "1rem",
                  }}
                >
                  Holders
                </th>
                <th
                  style={{
                    color: "#656565",
                    textAlign: "right",
                    padding: "1rem",
                  }}
                >
                  Comments
                </th>
              </>
            )}
            <th
              style={{ color: "#656565", textAlign: "right", padding: "1rem" }}
            >
              24H
            </th>
          </tr>
        </thead>
        <tbody>
          {feed.map((data: CardProps) =>
            parseFloat(data.market_cap) >= 0 ? (
              <tr
                key={data.id}
                // @ts-ignore
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
                  <HStack spacing="1rem">
                    <Image
                      boxSize="4rem"
                      objectFit="cover"
                      src={data.image}
                      alt="Ticker Image"
                    />
                    <VStack alignItems="flex-start" spacing="0">
                      <Heading as="h4" size="sm" fontSize="16px" color="white">
                        {data.ticker}
                      </Heading>
                      <Text fontSize="12px">{data.name}</Text>
                      <Text
                        fontSize="12px"
                        color="gray.500"
                        maxWidth="200px"
                        overflow="hidden"
                        wordBreak="break-all"
                      >
                        {data.description.slice(0, 20)}...
                      </Text>
                    </VStack>
                  </HStack>
                </td>
                {/* Remaining Columns */}
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
                      <CreatedAtComponent
                        timeStamp={parseInt(data.created_at.toString())}
                        noHeader
                      />
                    </td>
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
                  </>
                )}
                <td
                  style={{
                    textAlign: "right",
                    color: "white",
                    padding: "1rem",
                    borderTop: "1px solid #343434",
                    borderBottom: "1px solid #343434",
                  }}
                >
                  {data.market_cap}
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
                      {data.fee_basis_points}
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
                  </>
                )}
                <td
                  style={{
                    textAlign: "right",
                    padding: "1rem",
                    color: "#00FF29",
                    borderTop: "1px solid #343434",
                    borderBottom: "1px solid #343434",
                    borderRight: "1px solid #343434",
                  }}
                >
                  +{data.replies}%
                </td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
    </VStack>
  );
}

export default DataTable;
