import React from 'react';
import styled from 'styled-components';
import Slider from '@material-ui/core/Slider';

// date constants
const millisecondsInDay = 86400000;
const currentDay = new Date();

export const UI = ({ day, startDate, maxDays, onChangeTime, onPause }) => {
  currentDay.setTime(startDate.getTime() + day * millisecondsInDay);

  return (
    <Container>
      <Header>
        2019 Novel Coronavirus COVID-19 (2019-nCoV): Global Cases over time.
      </Header>
      <Spacer />
      <MainContainer>
        <DateText>{currentDay.toLocaleString()}</DateText>
        <Controls>
          <Slider value={day} min={0} max={maxDays} onChange={onChangeTime} />
        </Controls>
      </MainContainer>
      <Footer>
        Visualisation ©Patrick Nasralla 2020 | Data taken from Johns Hopkins
        Coronavirus Resource Center dataset.
      </Footer>
    </Container>
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

const Header = styled.div`
  display: flex;
  justify-content: center;
  pointer-events: all;
  background: #00000099;
  width: 100%;
  height: 5%;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  pointer-events: all;
  background: #00000099;
  width: 100%;
  height: 5%;
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
  width: 80%;
  padding: 1rem;
`;

const StyledSlider = styled(Slider)`
  && {
    color: white;
  }
`;
