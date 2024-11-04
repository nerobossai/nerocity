// @ts-nocheck
import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.button`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background: ${(props) =>
    props.disabled
      ? "#C2C2C2"
      : props.colorbg
        ? props.colorbg
        : "rgb(0, 0, 0)"};
  border-color: ${(props) =>
    props.bordercolor ? props.bordercolor : "transparent"};
  border: ${(props) =>
    props.noborder ? "none" : props.border ? props.border : "2px"};
  padding: ${(props) =>
    props.$nopadding ? "0" : props.padding ? props.padding : "5px 20px"};

  height: ${(props) => (props.height ? props.height : "48px")};
  width: ${(props) => (props.width ? props.width : "234px")};
  max-width: ${(props) => (props.maxwidth ? props.maxwidth : "100%")};

  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "500")};
  border-radius: ${(props) =>
    props.borderradius ? props.borderradius : "6.89"}px;
  color: ${(props) => (props.iconcolor ? props.iconcolor : "#fff")};
  font-size: ${(props) => (props.iconsize ? props.iconsize : "15")}px;
  font-family: ${(props) =>
    props.fontfamily ? props.fontfamily : "System85Medium"};
  font-style: normal;
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "14")}px;
  text-transform: uppercase;
  letter-spacing: -0.01em;

  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) =>
    props.marginbottom ? props.marginbottom : "0px"};
  margin-top: ${(props) => (props.margintop ? props.margintop : "0px")};
  margin-left: ${(props) => (props.marginleft ? props.marginleft : "0px")};
  margin-right: ${(props) => (props.marginright ? props.marginright : "0px")};
  border: 2px solid;
  border-color: ${(props) =>
    props.disabled
      ? "#C2C2C2"
      : props.colorbg === "#fff"
        ? "#000000"
        : "#000000"};
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:before {
    content: "";
    display: block;
    position: absolute;
    border-top: 5px solid
      ${(props) =>
        props.colorbg === "#fff"
          ? "#fff"
          : props.disabled
            ? "#C2C2C2"
            : "#000"};
    border-bottom: 5px solid
      ${(props) =>
        props.colorbg === "#fff"
          ? "#fff"
          : props.disabled
            ? "#C2C2C2"
            : "#000"};
    height: calc(100% - 6px);
    top: 50%;
    transform: translateY(-50%);
    left: 14px;
    right: 14px;
    box-sizing: border-box;
    z-index: 4;
    transition: all 0.3s;
  }

  &:after {
    display: block;
    position: absolute;
    content: "";
    border-left: 5px solid
      ${(props) =>
        props.colorbg === "#fff"
          ? "#fff"
          : props.disabled
            ? "#C2C2C2"
            : "#000"};
    border-right: 5px solid
      ${(props) =>
        props.colorbg === "#fff"
          ? "#fff"
          : props.disabled
            ? "#C2C2C2"
            : "#000"};
    width: calc(100% - 6px);
    top: 14px;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
    transition: all 0.3s;
  }

  &:hover {
    &:before {
      left: 18px;
      right: 18px;
    }

    &:after {
      top: 16px;
      bottom: 16px;
    }
  }
`;

const InnerDiv = styled.div`
  border: 2px solid ${(props) => (props.colorbg === "#fff" ? "#000" : "#fff")};
  border-radius: 2px;
  position: absolute;
  left: ${(props) => (props.colorbg === "#fff" ? "4px" : "5px")};
  right: ${(props) => (props.colorbg === "#fff" ? "5px" : "5px")};
  top: ${(props) => (props.colorbg === "#fff" ? "5px" : "5px")};
  bottom: ${(props) => (props.colorbg === "#fff" ? "4px" : "5px")};
`;

function PrimaryButton(props) {
  return (
    <ButtonContainer {...props}>
      <InnerDiv colorbg={props.colorbg} />
      {props.children}
    </ButtonContainer>
  );
}

export default PrimaryButton;
