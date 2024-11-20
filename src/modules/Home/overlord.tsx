import { Stack } from "@chakra-ui/react";
import React from "react";

import Card from "@/components/Card";
import MainCard from "@/components/Card/MainCard";

import type { AgentResponse } from "./services/homeApiClient";

function OverlordModule(props: { overlord: AgentResponse }) {
  // const [loading, setLoading] = useState(false);
  // const [overlord, setOverlord] = useState<AgentResponse>();

  // const fetchOverlord = async () => {
  //   try {
  //     setLoading(true);
  //     const resp = await homeApiClient.overlord();
  //     setOverlord(resp);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchOverlord();
  // }, []);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      marginBottom="20px"
      maxWidth={{ base: "auto", lg: "80%" }}
    >
      <MainCard {...props.overlord} />
      <Card {...props.overlord} />
    </Stack>
  );
}

export default OverlordModule;
