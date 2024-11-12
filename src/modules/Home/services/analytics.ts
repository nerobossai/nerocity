import { AnalyticsEvents } from "@/constants/analyticsEvents";
import { mixpanelAnalytics } from "@/utils/Analytics";
import { logger } from "@/utils/Logger";

export type TrackVisitorInput = {
  utm_source: string | undefined;
  utm_medium: string | undefined;
  utm_campaign: string | undefined;
  link: string;
};

export type TrackWalletConnect = {
  wallet_address: string;
};

export const trackVisitor = (data: TrackVisitorInput) => {
  try {
    mixpanelAnalytics.trackEvent(AnalyticsEvents.visitors, data);
  } catch (err: any) {
    logger.error(err);
  }
};

export const trackWalletConnect = (data: TrackWalletConnect) => {
  try {
    mixpanelAnalytics.trackEvent(AnalyticsEvents.wallet_connect, data);
  } catch (err: any) {
    logger.error(err);
  }
};
