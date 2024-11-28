import { useEffect, useRef } from "react";

import type {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from "@/public/static/charting_library";
import { widget } from "@/public/static/charting_library";

import CustomDataFeed from "./CustomDataFeed";
import styles from "./index.module.css";

export interface TVChartContainerProps {
  symbol: string;
  interval: ResolutionString;
  library_path: string;
  locale: string;
  charts_storage_url: string;
  charts_storage_api_version: string;
  client_id: string;
  user_id: string;
  fullscreen: boolean;
  autosize: boolean;
  mintKey: string;
}

export const TVChartContainer = (props: TVChartContainerProps) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol || "BTCUSD",
      datafeed: new CustomDataFeed(props.mintKey, props.symbol) as any,
      container: chartContainerRef.current,
      interval: "30s" as ResolutionString,
      library_path: props.library_path,
      locale: (props.locale as LanguageCode) || "en",
      disabled_features: [
        "use_localstorage_for_settings",
        "header_resolutions",
      ],
      enabled_features: [],
      fullscreen: props.fullscreen || false,
      autosize: props.autosize || true,
      theme: "dark",
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.classList.add("apply-common-tooltip");
        button.innerHTML = "Check API";
      });
    });

    return () => {
      tvWidget.remove();
    };
  }, [props]);

  return (
    <div
      ref={chartContainerRef}
      className={styles.TVChartContainer}
      style={{ height: "400px" }}
    />
  );
};
