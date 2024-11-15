import Seo from "@/components/Seo";
import { Meta } from "@/layouts/Meta";
import ProfileModule from "@/modules/Profile";
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
        <ProfileModule />
      </Main>
    </>
  );
};
export default Index;
