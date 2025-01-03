import { GoogleAnalytics } from "@next/third-parties/google";
import type { ReactNode } from "react";
import React from "react";
import styled from "styled-components";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
// import MarqueeBanner from "@/components/Banner/TestVersion";

const Container = styled.div<{ $noHeaderOnMobile?: boolean }>`
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
const ContentWrapper = styled.div<{ nopadding?: boolean }>`
  flex: 1; /* Allows this section to grow and push the footer down */
  padding: ${(props) => (props.nopadding ? "0" : "1rem")};
`;

interface IPropType {
  heading?: string;
  bgcolor?: string;
  meta?: JSX.Element;
  children?: ReactNode;
  nopadding?: boolean;
  nofooter?: boolean;
  nomain?: boolean;
  noHeaderOnMobile?: boolean;
}

const Main = (props: IPropType) => {
  const { children, bgcolor, nopadding, nofooter, nomain, noHeaderOnMobile } =
    props;

  return (
    <Container $noHeaderOnMobile={noHeaderOnMobile}>
      <GoogleAnalytics gaId="G-7KQEXTEH06" />
      <Header />
      {/* <MarqueeBanner /> */}
      <ContentWrapper nopadding={nopadding}>{children}</ContentWrapper>
      {nofooter ? null : <Footer />}
    </Container>
  );
};

export default Main;
