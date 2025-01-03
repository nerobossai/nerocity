import { useEffect } from "react";

import TermsModal from "@/components/Modals/TermsModal";
import Seo from "@/components/Seo";
import { Meta } from "@/layouts/Meta";
import HomeModule from "@/modules/Home";
import Main from "@/templates/Main";
import { AppConfig } from "@/utils/AppConfig";

const Index = () => {
  useEffect(() => {
    document.body.classList.add("home");
  }, []);

  return (
    <>
      <Seo />
      <Main
        // @ts-ignore
        meta={
          <Meta title={AppConfig.title} description={AppConfig.description} />
        }
      >
        <TermsModal />
        <HomeModule />
      </Main>
    </>
  );
};
export default Index;
