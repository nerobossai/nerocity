import { AnalyticsEvents } from "@/constants/analyticsEvents";
import { mixpanelAnalytics } from "@/utils/Analytics";
import { logger } from "@/utils/Logger";

export type TrackBuy = {
  agent_address: string;
  timestamp: number;
  wallet_address: string;
  amount_of_coins_bought_dollar: number;
  revenue_in_dollar: number;
  amount_of_coins_bought_sol: number;
  revenue_in_sol: number;
};

export type TrackSell = {
  agent_address: string;
  timestamp: number;
  wallet_address: string;
  amount_of_coins_sold_dollar: number;
  amount_of_coins_sold_token: number;
};

export type TrackComment = {
  agent_address: string;
  timestamp: number;
  wallet_address: string;
};

export type TrackReply = {
  agent_address: string;
  timestamp: number;
  wallet_address: string;
};

export const trackBuy = (data: TrackBuy) => {
  try {
    mixpanelAnalytics.trackEvent(AnalyticsEvents.buy, data);
  } catch (err: any) {
    logger.error(err);
  }
};

export const trackSell = (data: TrackSell) => {
  try {
    mixpanelAnalytics.trackEvent(AnalyticsEvents.sell, data);
  } catch (err: any) {
    logger.error(err);
  }
};

export const trackComment = (data: TrackComment) => {
  try {
    mixpanelAnalytics.trackEvent(AnalyticsEvents.comment, data);
  } catch (err: any) {
    logger.error(err);
  }
};

export const trackReply = (data: TrackReply) => {
  try {
    mixpanelAnalytics.trackEvent(AnalyticsEvents.reply, data);
  } catch (err: any) {
    logger.error(err);
  }
};
