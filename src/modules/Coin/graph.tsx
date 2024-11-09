import type { StackProps } from "@chakra-ui/react";
import { HStack, Stack } from "@chakra-ui/react";
import type { IChartApi } from "lightweight-charts";
import { createChart } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

import type { CandlestickResponse } from "../Home/services/homeApiClient";

export type CandlestickChartProps = Partial<StackProps> & {
  priceData: {
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
  };
  symbol: string;
  data: CandlestickResponse;
};

const CandlestickChart = (props: CandlestickChartProps) => {
  const chartContainerRef = useRef<any>(null);
  const chart = useRef<IChartApi>();
  const resizeObserver = useRef<any>();
  const [priceData, setPriceData] = useState(props.priceData);
  const { symbol } = props;

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    chart.current = createChart(container, {
      width: container.clientWidth,
      height: 400,
      layout: {
        background: { color: "#131722" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#2b2b43" },
        horzLines: { color: "#2b2b43" },
      },
      rightPriceScale: {
        borderColor: "#485c7b",
        scaleMargins: { top: 0.2, bottom: 0.2 },
        visible: true,
        autoScale: false,
        mode: 1,
      },
      timeScale: {
        borderColor: "#485c7b",
      },
    });

    const candlestickSeries = chart.current.addCandlestickSeries({
      upColor: "#4caf50",
      downColor: "#f44336",
      borderUpColor: "#4caf50",
      borderDownColor: "#f44336",
      wickUpColor: "#4caf50",
      wickDownColor: "#f44336",
      priceFormat: {
        type: "price",
        precision: 9, // Display up to 9 decimals
        minMove: 0.00000001, // Smallest increment for 9 decimals
      },
    });

    const data = props.data.map((d) => {
      return {
        time: d.timestamp,
        open: parseFloat(d.open.toFixed(9)),
        high: parseFloat(d.high.toFixed(9)),
        low: parseFloat(d.low.toFixed(9)),
        close: parseFloat(d.close.toFixed(9)),
      };
    });

    // @ts-ignore
    candlestickSeries.setData(data);

    // Update price details on crosshair movement
    chart.current.subscribeCrosshairMove((param) => {
      if (param && param.seriesData && param.seriesData.size > 0) {
        const candlestickData = param.seriesData.get(candlestickSeries);
        if (candlestickData) {
          setPriceData({
            // @ts-ignore
            open: candlestickData.open,
            // @ts-ignore
            high: candlestickData.high,
            // @ts-ignore
            low: candlestickData.low,
            // @ts-ignore
            close: candlestickData.close,
          });
        }
      }
    });

    return () => {
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, [props.data]);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const { width, height } = entries[0]!.contentRect;
      chart.current!.applyOptions({ width, height });
      setTimeout(() => {
        chart.current!.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  return (
    <Stack {...props}>
      {/* Symbol and price details */}
      <HStack>
        <h2>{symbol}</h2>
        <div>Open: {priceData.open !== null ? priceData.open : "--"}</div>
        <div>High: {priceData.high !== null ? priceData.high : "--"}</div>
        <div>Low: {priceData.low !== null ? priceData.low : "--"}</div>
        <div>Close: {priceData.close !== null ? priceData.close : "--"}</div>
      </HStack>

      <div ref={chartContainerRef} />
    </Stack>
  );
};

export default CandlestickChart;
