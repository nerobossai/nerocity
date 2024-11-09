import { Stack, Text } from "@chakra-ui/react";
import React from "react";

import Card from "@/components/Card";

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
    <Stack justifyContent="center" alignItems="center">
      <Text color="red.600" fontWeight="bold" fontSize="1.5rem" padding="1rem">
        AI Overlord
      </Text>
      <Card {...props.overlord} />
    </Stack>
  );
}

export default OverlordModule;
