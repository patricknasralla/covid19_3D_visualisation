import styled from "styled-components";
import React from "react";

export const LoadingSpinner = ({ vCentered, loadingText }) => (
  <Container vCentered={vCentered}>
    <Spinner>
      <div />
      <div />
      <div />
      <div />
    </Spinner>
    {loadingText && <p>{loadingText}</p>}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  ${props => props.vCentered && `align-items: center;`};
  font-size: 1.3rem;
`;

const Spinner = styled("div")`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${({ theme }) => theme.main};
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  div:nth-of-type(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  div:nth-of-type(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  div:nth-of-type(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  div:nth-of-type(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`;
