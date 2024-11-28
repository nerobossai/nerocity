import mixpanel from "mixpanel-browser";

import { MIXPANEL_TOKEN_DEV, MIXPANEL_TOKEN_PROD } from "./config";

export class Mixpanel {
  constructor() {
    mixpanel.init(
      process.env.NEXT_PUBLIC_APP_ENV === "development"
        ? MIXPANEL_TOKEN_DEV
        : MIXPANEL_TOKEN_PROD,
      {
        debug: process.env.NEXT_PUBLIC_APP_ENV === "development",
        api_host: "https://api.mixpanel.com",
      },
    );

    mixpanel.opt_in_tracking();
  }

  setIdentity(number: string) {
    mixpanel.identify(number);
    mixpanel.people.set({
      $name: number,
    });
  }

  removeIdentity() {
    mixpanel.reset();
  }

  trackEvent(
    event: string,
    properties: {
      [key: string]: string | number | Array<any> | undefined;
    } = {},
  ) {
    const propertiesToTrack = { ...properties };
    mixpanel.track(event, {
      ...propertiesToTrack,
      product: "nerocity-webapp",
    });
  }
}

export const mixpanelAnalytics = new Mixpanel();
