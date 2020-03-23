import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { TextureLoader } from 'three';

import { DataParser } from '../utilities/DataParser';
import { lightTheme, darkTheme } from './Theme';
import { LoadingSpinner } from './Spinner';
import { Visualiser } from './Visualiser';

export const App = () => {
  const [loadingItems, setLoadingItems] = useState([
    'Getting Case Data',
    'Loading Textures',
  ]);
  const [theme, setTheme] = useState(darkTheme);
  const [data, setData] = useState(null);
  const [spriteTexture, setSpriteTexture] = useState(null);
  const [globeTexture, setGlobeTexture] = useState(null);
  const [globeBumpMap, setGlobeBumpMap] = useState(null);
  const [globeLightMap, setGlobeLightMap] = useState(null);

  // load data from CSV file and Textures into memory.
  useEffect(() => {
    DataParser.getDataFromCSV('data.csv').then(data => {
      setData(data);
      setLoadingItems(prevState =>
        prevState.filter(item => item !== 'Getting Case Data'),
      );
    });
    let textureCount = 0;
    setSpriteTexture(
      new TextureLoader().load('textures/circle.png', () => {
        textureCount++;
        if (textureCount < 4) return;
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading Textures'),
        );
      }),
    );
    setGlobeTexture(
      new TextureLoader().load('textures/finalTexture.jpg', () => {
        textureCount++;
        if (textureCount < 4) return;
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading Textures'),
        );
      }),
    );
    setGlobeBumpMap(
      new TextureLoader().load('textures/earthbump8k.jpg', () => {
        textureCount++;
        if (textureCount < 4) return;
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading Textures'),
        );
      }),
    );
    setGlobeLightMap(
      new TextureLoader().load('textures/cities_8k.png', () => {
        textureCount++;
        if (textureCount < 4) return;
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading Textures'),
        );
      }),
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {loadingItems.length ? (
        <LoadingSpinner vCentered={true} loadingText={loadingItems} />
      ) : (
        <Visualiser
          data={data}
          spriteTexture={spriteTexture}
          globeTexture={globeTexture}
          globeBumpMap={globeBumpMap}
          globeLightMap={globeLightMap}
        />
      )}
    </ThemeProvider>
  );
};
