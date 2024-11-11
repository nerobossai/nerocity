import { AnalyticsEvents } from "@/constants/analyticsEvents";
import { mixpanelAnalytics } from "@/utils/Analytics";
import { logger } from "@/utils/Logger";

export type TrackAgentCreation = {
  agent_address: string;
  timestamp: number;
  agent_details: any;
};

export const trackAgentCreation = (data: TrackAgentCreation) => {
  try {
    mixpanelAnalytics.trackEvent(AnalyticsEvents.agent_creation, data);
  } catch (err: any) {
    logger.error(err);
  }
};
