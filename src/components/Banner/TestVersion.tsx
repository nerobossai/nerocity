import React from "react";
import styled, { keyframes } from "styled-components";

const marqueeAnimation = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const BannerContainer = styled.div`
  width: 100%;
  background-color: #22c55e;
  overflow: hidden;
`;

const MarqueeContent = styled.div`
  display: inline-block;
  white-space: nowrap;
  animation: ${marqueeAnimation} 20s linear infinite;
`;

const MarqueeText = styled.span`
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0 1rem;
`;

const MarqueeBanner = () => {
  return (
    <BannerContainer>
      <MarqueeContent>
        <MarqueeText>
          TEST VERSION • TEST VERSION • TEST VERSION • TEST VERSION • TEST
          VERSION • TEST VERSION • TEST VERSION • TEST VERSION
        </MarqueeText>
      </MarqueeContent>
    </BannerContainer>
  );
};

export default MarqueeBanner;
