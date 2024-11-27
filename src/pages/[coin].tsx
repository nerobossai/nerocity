import Script from "next/script";
import { useState } from "react";

import Seo from "@/components/Seo";
import { Meta } from "@/layouts/Meta";
import CoinModule from "@/modules/Coin";
import Main from "@/templates/Main";
import { AppConfig } from "@/utils/AppConfig";

const Index = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);

  return (
    <>
      <Seo />
      <Main
        // @ts-ignore
        meta={
          <Meta title={AppConfig.title} description={AppConfig.description} />
        }
        nofooter
      >
        <Script
          src="/static/datafeeds/udf/dist/bundle.js"
          strategy="lazyOnload"
          onReady={() => {
            setIsScriptReady(true);
          }}
        />
        {isScriptReady && <CoinModule />}
      </Main>
    </>
  );
};
export default Index;
