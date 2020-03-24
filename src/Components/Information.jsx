import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export const Information = ({ onClickOut }) => {
  return ReactDOM.createPortal(
    <Overlay onClick={onClickOut}>
      <ModalContainer>
        <h1>How to Use.</h1>
        <p>Left click and drag or drag finger to rotate the globe.</p>
        <p>Scroll or pinch to zoom in and out.</p>
        <p>
          Move the slider to move through time. Play/Pause button starts and
          stops playback.
        </p>
        <h1>What is this showing me?</h1>
        <p>
          The visualisation displays the (cumulative) number of confirmed
          Coronavirus cases over time by country/region. Data is taken from the
          Johns Hopkins combined global dataset which is available here:{' '}
          <a
            href="https://github.com/CSSEGISandData/COVID-19"
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            https://github.com/CSSEGISandData/COVID-19
          </a>
          .
        </p>
        <p>
          Each point is displaced away from the surface by an amount that takes
          into account the number of cases of the 4 closest recorded
          countries/regions and applies an inverse square falloff. Displacement
          is the Log(10) of the total cases for that point. This means that if
          there are only a few cases in an area, the number of dots and their
          displacement will be much less than if there are hundreds or
          thousands.
        </p>
        <p>
          The more cases there are, the more the virus will spread to
          neighbouring regions and so spread as well as displacement increase as
          cases do.
        </p>
        <h1>Why create this?</h1>
        <p>
          A great deal of in depth visualisations for these data currently
          exist.{' '}
          <a
            href="https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            The dashboard created by Johns Hopkins
          </a>{' '}
          is a good example. However, none of these attempt to convey the idea
          of how a disease spreads over time. When we talk about "flattening the
          curve" what we mean is attempting to slow the spread of disease, not
          stop it. But my hope is that this visualisation will help people
          understand how important that "slowing down" is. Just look at how
          quickly the spread has ramped up from the beginning of March. This
          aims to give viewers an idea of just how crazy an exponential increase
          is by using real data.
        </p>
        <p>
          We can all help to curb this spread by adhering to the advice given by
          medical professionals and public health organisations. In the end, if
          this makes even one person think that it's better to distance and
          isolate then I'll think it was time well spent!
        </p>
        <h1>How was this made?</h1>
        <p>
          Built in React with Three.js and custom Vertex/Fragment GLSL shader
          code.
        </p>
        <p>
          Animation runs entirely on GPU once initial calculations triangulate
          distances from data points (given in data by lat/long coordinates).
          The case data is sent to the shader via a texture (tutorial on that is
          imminent).
        </p>
        <p>
          Source code available{' '}
          <a
            href="https://github.com/patricknasralla/covid19_3D_visualisation"
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            here
          </a>
          . Feel free to fork or drop me a{' '}
          <a
            href="https://twitter.com/GomiNoSensei"
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            tweet
          </a>{' '}
          if you think things can be improved (or if you'd just like to
          comment).
        </p>
      </ModalContainer>
    </Overlay>,
    document.getElementById('root'),
  );
};

// styles
const Overlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: #101921dd;
`;

const ModalContainer = styled.div`
  width: 80%;
  height: 80%;
  overflow: scroll;
  padding: 2rem;
  h1 {
    font-size: 3rem;
    margin-top: 3.5rem;
  }
  p {
    font-size: 2rem;
  }
  @media (max-width: 960px) {
    h1 {
      font-size: 2rem;
      margin-top: 2.5rem;
    }
    p {
      font-size: 1.5rem;
    }
  }
`;
