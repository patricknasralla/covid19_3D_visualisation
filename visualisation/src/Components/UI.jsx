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
  onChangeData,
  onPause,
  paused,
}) => {
  currentDay.setTime(startDate.getTime() + day * millisecondsInDay);

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(prevState => !prevState);
  };

  return (
    <>
      <Container>
        <Header>
          <Item>2019-nCoV: Global Data Over Time.</Item>
          <Item>
            <Select
              name="DataType"
              id="DataType"
              onChange={event => onChangeData(event.target.value)}
            >
              <option value={0}>Cases</option>
              <option value={1}>Deaths</option>
              {/*<option value={2}>Recovered</option>*/}
            </Select>
          </Item>
          <Item>
            <Button onClick={handleModalOpen}>
              <AboutIcon />
            </Button>
          </Item>
        </Header>
        <Spacer />
        <MainContainer>
          <DateText>
            {currentDay.toLocaleString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </DateText>
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
  height: 7.5%;
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

const Select = styled.select`
  display: block;
  font-size: 1.8rem;
  font-family: 'VT323', monospace;
  color: #dadddf;
  line-height: 1.3;
  padding: 0.6rem 0.8rem 0.5rem 0.8rem;
  width: 100%;
  max-width: 100%;
  min-width: 6rem;
  box-sizing: border-box;
  margin: 0;
  border-top: 1px solid #dadddf;
  border-bottom: 1px solid #dadddf;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #00000099;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
  :focus {
    outline: none;
  }
  ::-ms-expand {
    display: none;
  }
  :hover {
    border-color: #dadddf;
  }
  @media (max-width: 960px) {
    font-size: 1.5rem;
  }
`;
