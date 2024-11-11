import Seo from "@/components/Seo";
import { Meta } from "@/layouts/Meta";
import CoinModule from "@/modules/Coin";
import Main from "@/templates/Main";
import { AppConfig } from "@/utils/AppConfig";

const Index = () => {
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
        <CoinModule />
      </Main>
    </>
  );
};
export default Index;
