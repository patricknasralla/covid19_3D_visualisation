import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { WebGLRenderer, Scene } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

import {
  createCamera,
  createGlobeMesh,
  createLights,
  createParticleMesh,
} from '../three/visualiser';
import { LoadingOverlay, LoadingSpinner } from './Spinner';
import { UI } from './UI';

// three globals (these don't work as state as the render loop is outside react)
let threeTime = 0;
let play = false;
let playbackSpeed = 0.015;
let dataFrom = 0;

export const Visualiser = ({
  data,
  dataTextures,
  spriteTexture,
  globeTexture,
}) => {
  const attach = useRef();
  const [loading, setLoading] = useState(true);
  const [timeValue, setTimeValue] = useState(0);
  const [maxDays, setMaxDays] = useState(1);
  const [pause, setPause] = useState(!play);
  const [
    confirmedDataTexture,
    deathsDataTexture,
    recoveredDataTexture,
  ] = dataTextures;

  useEffect(() => {
    play = !play;
  }, [pause]);

  useEffect(() => {
    const container = attach.current;
    const [camera] = createCamera(container);

    const uniforms = {
      pointTexture: { value: spriteTexture },
      confirmedData: { value: confirmedDataTexture },
      deathsData: { value: deathsDataTexture },
      // recoveredData: { value: recoveredDataTexture },
      day: { value: 0 },
      totalDays: { value: data.totalDays },
      totalLocations: { value: data.totalLocations },
      tween: { value: 0 },
      pixelRatio: { value: window.devicePixelRatio },
      containerHeight: { value: container.clientHeight },
      dataFrom: { value: 0 },
    };

    const scene = new Scene();

    globeTexture.rotation = 0;

    createLights(scene);
    createGlobeMesh(scene, spriteTexture, globeTexture);
    createParticleMesh(scene, data, uniforms);

    const renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // create stats for dev checking
    let stats;
    if (process.env.NODE_ENV === 'development') {
      stats = new Stats();
      container.appendChild(stats.dom);
    }

    // kept here as eventListener can't seem to send parameters)
    function onWindowResize() {
      // set the aspect ratio to match the new browser window aspect ratio
      camera.aspect = container.clientWidth / container.clientHeight;

      // update the camera's frustum
      camera.updateProjectionMatrix();

      // update the size of the renderer AND the canvas AND the uniforms!
      uniforms.containerHeight.value = container.clientHeight;
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    renderer.setAnimationLoop(() => {
      render(data.totalDays, scene, camera, renderer, uniforms);
      if (process.env.NODE_ENV === 'development') stats.update();
    });
    setMaxDays(data.totalDays);
    setLoading(false);
  }, [
    confirmedDataTexture,
    deathsDataTexture,
    recoveredDataTexture,
    data,
    spriteTexture,
    globeTexture,
  ]);

  const render = (totalDays, scene, camera, renderer, uniforms) => {
    if (uniforms.dataFrom.value !== dataFrom) {
      uniforms.dataFrom.value = dataFrom;
    }
    if (threeTime < totalDays) {
      let day = Math.trunc(threeTime);
      uniforms.day.value = day;
      uniforms.tween.value = threeTime - day;
      if (play) threeTime += playbackSpeed;
      setTimeValue(threeTime);
    }
    renderer.render(scene, camera);
  };

  const handleTimeChange = time => {
    threeTime = time;
  };

  const handlePlayPause = () => {
    setPause(prevState => !prevState);
  };

  const handleChangeData = value => {
    dataFrom = value;
  };

  return (
    <>
      <Container ref={attach} />
      <UI
        day={timeValue}
        startDate={new Date(2020, 0, 21)}
        maxDays={maxDays}
        onChangeTime={(event, newTime) => handleTimeChange(newTime)}
        onChangeData={value => handleChangeData(value)}
        onPause={handlePlayPause}
        paused={pause}
      />
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner
            vCentered={true}
            loadingText={['Performing Calculations']}
          />
        </LoadingOverlay>
      )}
    </>
  );
};

// Component Styles
const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;
