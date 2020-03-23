import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { init } from '../three/visualiser';

export const Visualiser = ({
  data,
  spriteTexture,
  globeTexture,
  globeBumpMap,
  globeLightMap,
}) => {
  const container = useRef();
  useEffect(() => {
    init(
      container,
      data,
      spriteTexture,
      globeTexture,
      globeBumpMap,
      globeLightMap,
    );
  });

  return <Container ref={container} />;
};

// Component Styles
const Container = styled.div`
  width: 100%;
  width: 100vw;
  height: 100%;
  height: 100vh;
`;
