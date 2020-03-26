import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import {
  DataTexture,
  RGBAFormat,
  TextureLoader,
  UnsignedByteType,
} from 'three';

import { darkTheme } from './Theme';
import { LoadingOverlay, LoadingSpinner } from './Spinner';
import { Visualiser } from './Visualiser';
import data from '../data.json';

export const App = () => {
  const [loadingItems, setLoadingItems] = useState([
    'Loading Textures',
    'Loading Data',
    'Loading DataTexture',
  ]);
  const [dataTexture, setDataTexture] = useState(null);
  const [spriteTexture, setSpriteTexture] = useState(null);
  const [globeTexture, setGlobeTexture] = useState(null);

  // load data from CSV file and Textures into memory.
  useEffect(() => {
    fetch('textureData.bin')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const tData = new Uint8Array(buffer);
        const dataTexture = new DataTexture(
          tData,
          data.totalLocations,
          data.totalDays,
          RGBAFormat,
          UnsignedByteType,
        );
        setDataTexture(dataTexture);
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading DataTexture'),
        );
      });

    let textureCount = 0;
    setSpriteTexture(
      new TextureLoader().load('textures/circle.png', () => {
        textureCount++;
        if (textureCount < 2) return;
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading Textures'),
        );
      }),
    );
    setGlobeTexture(
      new TextureLoader().load('textures/finalTexture.jpg', () => {
        textureCount++;
        if (textureCount < 2) return;
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading Textures'),
        );
      }),
    );
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      {loadingItems.length ? (
        <LoadingOverlay>
          <LoadingSpinner vCentered={true} loadingText={loadingItems} />
        </LoadingOverlay>
      ) : (
        <Visualiser
          data={data}
          dataTexture={dataTexture}
          spriteTexture={spriteTexture}
          globeTexture={globeTexture}
        />
      )}
    </ThemeProvider>
  );
};
