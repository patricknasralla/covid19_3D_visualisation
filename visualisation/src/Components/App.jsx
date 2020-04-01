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
import { inflate } from 'pako';

export const App = () => {
  const [loadingItems, setLoadingItems] = useState([
    'Loading Textures',
    'Loading Data',
    'Loading DataTextures',
  ]);
  const [data, setData] = useState(null);
  const [confirmedDataTexture, setConfirmedDataTexture] = useState(null);
  const [deathsDataTexture, setDeathsDataTexture] = useState(null);
  const [recoveredDataTexture, setRecoveredDataTexture] = useState(null);
  const [spriteTexture, setSpriteTexture] = useState(null);
  const [globeTexture, setGlobeTexture] = useState(null);

  // load data from CSV file and Textures into memory.
  useEffect(() => {
    fetch('data/staticData.bin')
      .then(response => response.text())
      .then(data => {
        const parsedData = JSON.parse(
          inflate(data.toString(), { to: 'string' }),
        );
        setData(parsedData);
        setLoadingItems(prevState =>
          prevState.filter(item => item !== 'Loading Data'),
        );
        return parsedData;
      })
      .then(data => {
        let textureCount = 0;
        fetch('data/confirmedTextureData.bin')
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
            setConfirmedDataTexture(dataTexture);
          })
          .then(() => {
            textureCount++;
            if (textureCount >= 3) {
              setLoadingItems(prevState =>
                prevState.filter(item => item !== 'Loading DataTextures'),
              );
            }
          });
        fetch('data/deathsTextureData.bin')
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
            setDeathsDataTexture(dataTexture);
          })
          .then(() => {
            textureCount++;
            if (textureCount >= 3) {
              setLoadingItems(prevState =>
                prevState.filter(item => item !== 'Loading DataTextures'),
              );
            }
          });
        fetch('data/recoveredTextureData.bin')
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
            setRecoveredDataTexture(dataTexture);
          })
          .then(() => {
            textureCount++;
            if (textureCount >= 3) {
              setLoadingItems(prevState =>
                prevState.filter(item => item !== 'Loading DataTextures'),
              );
            }
          });
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
          dataTextures={deathsDataTexture}
          spriteTexture={spriteTexture}
          globeTexture={globeTexture}
        />
      )}
    </ThemeProvider>
  );
};
