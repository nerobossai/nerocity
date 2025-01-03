import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: rgba(44, 27, 17, 0.95);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  color: #fff;
  font-weight: 600;
  font-family: "Arial", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Content = styled.div`
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
`;

const Text = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #b0b0b0;
  margin: 0;
  font-family: "Arial", sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(83, 49, 29, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: rgba(103, 61, 36, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 10px rgba(255, 165, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.2);
  }
`;

const TermsModal = () => {
  const [shouldShow, setShouldShow] = useState(() => {
    const accepted = localStorage.getItem("termsAccepted");
    return accepted !== "true"; // Show if not accepted
  });

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    setShouldShow(false);
  };

  // If terms aren't accepted, show the modal
  if (!shouldShow) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Title>Terms Acceptance</Title>
        <Content>
          <Text>
            I HEREBY CONFIRM THAT BY ACCESSING THE WHITEPAPER AND OTHER
            INFORMATIONAL MATERIALS, I WILL BE DEEMED TO HAVE REVIEWED AND
            ACCEPTED CERTAIN TERMS THEREIN, INCLUDING CONFIRMATIONS THAT I AM
            NOT BASED IN A JURISDICTION WHERE SUCH ACCESS WOULD BE PROHIBITED OR
            RESTRICTED IN ANY MANNER
          </Text>
        </Content>
        <Button onClick={handleAccept}>I Agree</Button>
      </ModalContainer>
    </Overlay>
  );
};

export default TermsModal;
