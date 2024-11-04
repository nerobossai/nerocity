import Head from "next/head";
import React from "react";

import { AppConfig } from "@/utils/AppConfig";

function Seo() {
  return (
    <Head>
      <title>{AppConfig.title}</title>

      <link rel="icon" href="/favicon.ico" />

      <meta name="description" content={AppConfig.description} />

      <meta property="og:title" content={AppConfig.title} />

      <meta property="og:description" content={AppConfig.description} />

      <meta property="og:image" content="/share.jpg" />
    </Head>
  );
}

export default Seo;
