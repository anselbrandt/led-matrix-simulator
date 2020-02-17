import React, { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';
import Chart from './Chart';
import useGetViewport from './useGetViewport';
import Controls from './Controls';
import LedGrid from './LedGrid';

function App() {
  const svgRef = useRef();
  const ledRef = useRef();
  const { width } = useGetViewport();
  const [svgWidth, setSvgWidth] = useState();
  const [svgHeight, setSvgHeight] = useState();
  const [domain, setDomain] = useState([0, 5]);
  const [range, setRange] = useState([0, 1]);
  const [expected, setExpected] = useState(2.5);
  const [variance, setVariance] = useState(1);
  const [sliderExp, setSliderExp] = useState(500);
  const [sliderVar, setSliderVar] = useState(500);
  const [sliderDomain, setSliderDomain] = useState(500);
  const [yMax, setYMax] = useState(gaussian(2.5, 2.5, 1));
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [yValue, setYValue] = useState(0);

  function gaussian(value, expected, variance) {
    const exponent =
      (-(value - expected) * (value - expected)) / (2 * variance * variance);
    return (
      (1 / (variance * Math.sqrt(2 * Math.PI))) * Math.pow(Math.E, exponent)
    );
  }

  useEffect(() => {
    if (width > 1000) {
      setSvgWidth(0.4 * 1000);
      setSvgHeight(0.4 * 1000 * 0.75);
    } else {
      setSvgWidth(0.4 * width);
      setSvgHeight(0.4 * width * 0.75);
    }
  }, [width]);

  useEffect(() => {
    setYMax(gaussian(2.5, 2.5, variance));
  }, [variance]);

  useEffect(() => {
    setYValue(gaussian(timer / 1000, expected, variance));
  }, [timer, expected, variance]);

  const handleSetExpected = event => {
    setSliderExp(event.target.value);
    setExpected((domain[1] / 1000) * event.target.value);
  };
  const handleSetVariance = event => {
    setSliderVar(event.target.value);
    const lowestVar = 0.39899;
    setVariance(((3 - lowestVar) / 1000) * event.target.value + lowestVar);
  };

  const handleSetDomain = event => {
    setSliderDomain(event.target.value);
    setDomain([0, 0.01 * event.target.value]);
    setTimer(0);
  };

  useEffect(() => {
    if (timerIsRunning) {
      const tick = setInterval(() => {
        if (timer > domain[1] * 1000) {
          setTimer(10);
        } else {
          setTimer(timer + 10);
        }
      }, 10);
      return () => clearInterval(tick);
    }
  }, [domain, timer, timerIsRunning]);

  const handleStartTimer = () => setTimerIsRunning(!timerIsRunning);
  const handleResetTimer = () => setTimer(0);

  return (
    <div className={styles.app}>
      <div>
        <LedGrid
          svgRef={ledRef}
          width={svgWidth * 0.65}
          brightness={yValue / yMax}
        />
      </div>
      <div className={styles.title}>
        <div>Gaussian Pulsating LED Simulator</div>
        <div>
          Inspired by the{' '}
          <a href="https://avital.ca/notes/a-closer-look-at-apples-breathing-light">
            reverse engineerring
          </a>{' '}
          of the Macbook Sleep Indicator
        </div>
      </div>
      <div>
        <Chart
          svgRef={svgRef}
          width={svgWidth}
          height={svgHeight}
          domain={domain}
          range={range}
          expected={expected}
          variance={variance}
          timer={timer}
          gaussian={gaussian}
          yMax={yMax}
        />
      </div>
      <div className={styles.title}>
        <div>{(yValue / yMax).toFixed(2)}</div>
        <div>Upper curve is Gaussian scaled to 1.0</div>
      </div>
      <div>
        <Controls
          handleSetExpected={handleSetExpected}
          handleSetVariance={handleSetVariance}
          handleSetDomain={handleSetDomain}
          handleStartTimer={handleStartTimer}
          handleResetTimer={handleResetTimer}
        />
      </div>
    </div>
  );
}

export default App;
