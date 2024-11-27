import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Meta } from "@/layouts/Meta";
import { Breadcrumb } from "@/modules/Coin";
import CreateAgentModule from "@/modules/CreateAgent";
import Main from "@/templates/Main";
import { AppConfig } from "@/utils/AppConfig";
import { HStack } from "@chakra-ui/react";
import styled from "styled-components";

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
      <Breadcrumb loading={false} ticker="PRIVACY AND POLICY" />
      <HStack
        justifyContent="space-evenly"
        alignItems="start"
        flexDirection={["column-reverse", "row"]}
        gap="2rem"
        width="100%"
        p="20px"
      ></HStack>

      </Container>
        <Footer />
      </Main>
    </>
  );
};
export default Index;
