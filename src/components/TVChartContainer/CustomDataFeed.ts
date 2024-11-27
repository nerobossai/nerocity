import { homeApiClient } from "@/modules/Home/services/homeApiClient";
import type {
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
  ResolveCallback,
} from "@/public/static/charting_library/charting_library";

// Adjust the path to your library

class CustomDataFeed {
  private pollingInterval: NodeJS.Timeout | null = null;

  private mintKey: string;

  private symbol: string;

  constructor(mintKey: string, symbol: string) {
    this.mintKey = mintKey;
    this.symbol = symbol;
  }

  onReady(callback: OnReadyCallback): void {
    setTimeout(() => callback(this.getConfig()), 0);
  }

  private getConfig() {
    return {
      supports_search: false,
      supports_group_request: false,
      supports_marks: false,
      supports_timescale_marks: false,
      supported_resolutions: [
        "1",
        "5",
        "15",
        "60",
        "1D",
        "1M",
        "3M",
      ] as ResolutionString[], // Explicit cast
    };
  }

  resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: ResolveCallback,
    onResolveErrorCallback: ErrorCallback,
  ): void {
    const symbolInfo: any = {
      name: symbolName,
      ticker: symbolName,
      type: "crypto",
      session: "24x7",
      timezone: "Asia/Bangkok",
      minmov: 1,
      pricescale: 1000000000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "60", "1D"],
      supported_resolutions: ["1", "5", "15", "60", "1D"] as ResolutionString[],
      volume_precision: 2,
      data_status: "streaming",
    };

    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    range: { from: number; to: number },
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback,
  ): Promise<void> {
    const { from, to } = range;
    const bars = await this.fetchData(from, to);

    if (bars.length === 0) {
      onHistoryCallback([], { noData: true });
    } else {
      onHistoryCallback(bars, { noData: false });
    }
  }

  // Subscribe to real-time updates
  // subscribeBars(
  //   symbolInfo: LibrarySymbolInfo,
  //   resolution: ResolutionString,
  //   onRealtimeCallback: SubscribeBarsCallback,
  //   listenerGUID: string
  // ): void {
  //   console.log(`Subscribed to updates for ${symbolInfo.name} with GUID ${listenerGUID}`);

  //   this.pollingInterval = setInterval(() => {
  //     const now = Math.floor(Date.now() / 1000);
  //     const newBar = this.generateSingleBar(now, resolution);
  //     onRealtimeCallback(newBar);
  //   }, 5000); // Poll every 5 seconds
  // }

  // Unsubscribe from real-time updates
  // unsubscribeBars(listenerGUID: string): void {
  //   console.log(`Unsubscribed from updates for GUID ${listenerGUID}`);
  //   if (this.pollingInterval) {
  //     clearInterval(this.pollingInterval);
  //     this.pollingInterval = null;
  //   }
  // }

  private async fetchData(from: number, to: number) {
    const apiData = await homeApiClient.candlestickData(this.mintKey);
    if (apiData && apiData.length > 0) {
      const updatedData = apiData.map((d, i) => ({
        close: d.close,
        high: d.high,
        low: d.low,
        open: d.open,
        time: d.timestamp,
        volume: d.volume,
      }));

      const filteredData = updatedData.filter(
        (d) => d.time >= from && d.time <= to,
      );

      return filteredData.map((d) => ({ ...d, time: d.time * 1000 }));
    }
    return [];
  }
}

export default CustomDataFeed;
