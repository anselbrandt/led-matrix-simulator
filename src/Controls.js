import React from 'react';
import styles from './App.module.css';

export default function Controls(props) {
  return (
    <React.Fragment>
      <div>
        <input
          name="expected"
          type="range"
          min={0}
          max={1000}
          value={props.sliderExp}
          onChange={props.handleSetExpected}
        />

        <input
          name="domain"
          type="range"
          min={0}
          max={1000}
          value={props.sliderDomain}
          onChange={props.handleSetDomain}
        />
      </div>
      <div>
        <input
          name="variance"
          type="range"
          min={0}
          max={1000}
          value={props.sliderVar}
          onChange={props.handleSetVariance}
        />
      </div>
      <div className={styles.labels}>
        <div className={styles.label}>Expected</div>
        <div className={styles.label}>Variance</div>
        <div className={styles.label}>Period</div>
      </div>
      <div>
        <button onClick={props.handleStartTimer} className={styles.button}>
          Start/Stop
        </button>
        <button onClick={props.handleResetTimer} className={styles.button}>
          Reset
        </button>
      </div>
    </React.Fragment>
  );
}
