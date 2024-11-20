import dynamic from "next/dynamic";
import React, { useMemo } from "react";

import type { ResolutionString } from "@/public/static/charting_library/charting_library";

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer/TVChartContainer").then(
      (mod) => mod.TVChartContainer,
    ),
  { ssr: false },
);

const MemoizedChart = React.memo(
  ({ mintKey, symbol }: { mintKey: string; symbol: string }) => {
    const defaultWidgetProps = useMemo(
      () => ({
        symbol,
        interval: "D" as ResolutionString,
        library_path: "/static/charting_library/",
        locale: "en",
        charts_storage_url: "https://saveload.tradingview.com",
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        fullscreen: false,
        autosize: true,
      }),
      [],
    );

    return (
      <TVChartContainer
        {...defaultWidgetProps}
        mintKey={mintKey}
        symbol={symbol}
      />
    );
  },
);

export default MemoizedChart;
