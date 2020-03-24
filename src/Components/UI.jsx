import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from '@material-ui/core/Slider';

import { AboutIcon, PauseIcon, PlayIcon } from './Icons';
import { Information } from './Information';

// date constants
const millisecondsInDay = 86400000;
const currentDay = new Date();

export const UI = ({
  day,
  startDate,
  maxDays,
  onChangeTime,
  onPause,
  paused,
}) => {
  currentDay.setTime(startDate.getTime() + day * millisecondsInDay);

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(prevState => !prevState);
    console.log(modalOpen);
  };

  return (
    <>
      <Container>
        <Header>
          <Item>
            Novel Coronavirus COVID-19 (2019-nCoV): Global Cases over time.
          </Item>
          <Item>
            <Button onClick={handleModalOpen}>
              <AboutIcon />
            </Button>
          </Item>
        </Header>
        <Spacer />
        <MainContainer>
          <DateText>{currentDay.toLocaleString()}</DateText>
          <Controls>
            <Button onClick={onPause}>
              {!paused ? <PlayIcon /> : <PauseIcon />}
            </Button>
            <Slider
              value={day}
              min={0}
              max={maxDays}
              onChange={onChangeTime}
              color={'secondary'}
            />
          </Controls>
        </MainContainer>
        <Footer>
          <span>
            Visualisation (c)&nbsp;
            <a
              href="https://twitter.com/GomiNoSensei"
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              Patrick Nasralla
            </a>
            &nbsp;2020 | Data taken from&nbsp;
            <a
              href="https://github.com/CSSEGISandData/COVID-19"
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              Johns Hopkins COVID-19 Resource Center dataset
            </a>
            .
          </span>
        </Footer>
      </Container>
      {modalOpen && <Information onClickOut={handleModalOpen} />}
    </>
  );
};

// styles
const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  top: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Item = styled.div`
  text-align: center;
  margin: 0 3rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  background: #00000099;
  width: 100%;
  height: 5%;
  font-size: 1.8rem;
  @media (max-width: 960px) {
    font-size: 1.5rem;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
  pointer-events: all;
  background: #00000099;
  width: 100%;
  height: 5%;
  font-size: 1.5rem;
  @media (max-width: 960px) {
    font-size: 1rem;
  }
`;

const Spacer = styled.div`
  width: 100%;
  height: 60%;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: all;
  width: 100%;
  background: #00000099;
`;

const DateText = styled.div`
  color: ${({ theme }) => theme.highlight}DD;
  font-size: 6.5rem;
  padding: 1rem;
  @media (max-width: 960px) {
    font-size: 4.5rem;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  padding: 1rem;
`;

const Button = styled.div`
  width: 2rem;
  height: 2rem;
  margin-right: 2rem;
  cursor: pointer;
`;
