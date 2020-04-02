import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { TextureLoader } from 'three';

import { darkTheme } from './Theme';
import { LoadingOverlay, LoadingSpinner } from './Spinner';
import { Visualiser } from './Visualiser';
import { inflate } from 'pako';
import { DataParser } from '../utilities/DataParser';
import staticData from '../staticData';

export const App = () => {
  const [loadingItems, setLoadingItems] = useState([
    'Loading Textures',
    'Loading Data',
    'Loading DataTextures',
  ]);
  const [locationIndexData, setLocationIndexData] = useState(null);
  const [locationWeightData, setLocationWeightData] = useState(null);
  const [positionData, setPositionData] = useState(null);
  const [confirmedDataTexture, setConfirmedDataTexture] = useState(null);
  const [deathsDataTexture, setDeathsDataTexture] = useState(null);
  // const [recoveredDataTexture, setRecoveredDataTexture] = useState(null);
  const [spriteTexture, setSpriteTexture] = useState(null);
  const [globeTexture, setGlobeTexture] = useState(null);

  // load data from CSV file and Textures into memory.
  useEffect(() => {
    // load static data
    let staticResources = 0;
    fetch('data/positionData.bin')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const recoveredBuffer = inflate(buffer);
        const data = new Uint32Array(recoveredBuffer.buffer);
        setPositionData(data);
      })
      .then(() => {
        staticResources++;
        if (staticResources >= 3) {
          setLoadingItems(prevState =>
            prevState.filter(item => item !== 'Loading Data'),
          );
        }
      });
    fetch('data/locationIndexData.bin')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const recoveredBuffer = inflate(buffer);
        const data = new Uint16Array(recoveredBuffer.buffer);
        setLocationIndexData(data);
      })
      .then(() => {
        staticResources++;
        if (staticResources >= 3) {
          setLoadingItems(prevState =>
            prevState.filter(item => item !== 'Loading Data'),
          );
        }
      });
    fetch('data/locationWeightData.bin')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const recoveredBuffer = inflate(buffer);
        const data = new Float32Array(recoveredBuffer.buffer);
        setLocationWeightData(data);
      })
      .then(() => {
        staticResources++;
        if (staticResources >= 3) {
          setLoadingItems(prevState =>
            prevState.filter(item => item !== 'Loading Data'),
          );
        }
      });

    // load DataTextures
    let dataTextureCount = 0;
    fetch('data/confirmedTextureData.bin')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const dataTexture = DataParser.getTextureFromFile(buffer, staticData);
        setConfirmedDataTexture(dataTexture);
      })
      .then(() => {
        dataTextureCount++;
        if (dataTextureCount >= 2) {
          setLoadingItems(prevState =>
            prevState.filter(item => item !== 'Loading DataTextures'),
          );
        }
      });
    fetch('data/deathsTextureData.bin')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const dataTexture = DataParser.getTextureFromFile(buffer, staticData);
        setDeathsDataTexture(dataTexture);
      })
      .then(() => {
        dataTextureCount++;
        if (dataTextureCount >= 2) {
          setLoadingItems(prevState =>
            prevState.filter(item => item !== 'Loading DataTextures'),
          );
        }
      });
    // remove until correct recovered data available...
    // fetch('data/recoveredTextureData.bin')
    //   .then(response => response.arrayBuffer())
    //   .then(buffer => {
    //     const tData = new Uint8Array(buffer);
    //     const dataTexture = new DataTexture(
    //       tData,
    //       data.totalLocations,
    //       data.totalDays,
    //       RGBAFormat,
    //       UnsignedByteType,
    //     );
    //     setRecoveredDataTexture(dataTexture);
    //   })
    //   .then(() => {
    //     dataTextureCount++;
    //     if (dataTextureCount >= 3) {
    //       setLoadingItems(prevState =>
    //         prevState.filter(item => item !== 'Loading DataTextures'),
    //       );
    //     }
    //   });

    // Load Textures
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
          data={[
            positionData,
            locationIndexData,
            locationWeightData,
            staticData.totalLocations,
            staticData.totalDays,
          ]}
          dataTextures={[confirmedDataTexture, deathsDataTexture]}
          spriteTexture={spriteTexture}
          globeTexture={globeTexture}
        />
      )}
    </ThemeProvider>
  );
};
