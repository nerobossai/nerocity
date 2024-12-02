import styled from "styled-components";

import { Breadcrumb } from "@/components/BreadCrumb";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import TermsOfUsePage from "@/components/TermsofService.tsx";
import { Meta } from "@/layouts/Meta";
import Main from "@/templates/Main";
import { AppConfig } from "@/utils/AppConfig";

const Container = styled.div`
  padding: 2rem;
  padding-top: 0rem;
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto;
`;

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
        <Container>
          <Breadcrumb loading={false} ticker="TERMS OF SERVICE" />
          <TermsOfUsePage />
        </Container>
        <Footer />
      </Main>
    </>
  );
};
export default Index;
