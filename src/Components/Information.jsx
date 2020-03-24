import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export const Information = onClickOut => {
  return ReactDOM.createPortal(
    <Overlay onClick={onClickOut}>
      <ModalContainer />
    </Overlay>,
    document.getElementById('root'),
  );
};

// styles
const Overlay = styled.div`
  position: absolute;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: #10192199;
`;

const ModalContainer = styled.div`
  color: white;
  width: 80%;
  height: 80%;
  overflow: scroll;
`;
