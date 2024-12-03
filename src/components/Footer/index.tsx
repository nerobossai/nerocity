import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    align-items: center;
  }
`;

const CopyrightText = styled.div`
  font-size: 0.675rem;
  color: #4a5568;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const PolicyText = styled.div`
  font-size: 0.675rem;
  color: #4a5568;

  @media (min-width: 768px) {
    text-align: right;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <CopyrightText>Copyright © All rights by Kegen Labs, Inc.</CopyrightText>
      <PolicyText>
        This site is protected by reCAPTCHA and the Google Privacy Policy and
        Terms of Service apply
      </PolicyText>
    </FooterContainer>
  );
}

export default Footer;
