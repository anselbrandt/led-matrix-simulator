import React, { useEffect } from 'react';
import styles from './App.module.css';
import { select, scaleLinear } from 'd3';

export default function LedGrid(props) {
  const { svgRef, width, brightness } = props;
  function matrix(size) {
    const count = Math.sqrt(size) + 1;
    const coords = [];
    for (let i = 1; i < count; i++) {
      for (let j = 1; j < count; j++) {
        coords.push({ x: j, y: i });
      }
    }
    return coords;
  }

  const gridSize = 64;
  const data = matrix(gridSize);

  useEffect(() => {
    if (svgRef && width && data && brightness) {
      const svg = select(svgRef.current);
      svg.attr('width', `${width}px`).attr('height', `${width}px`);

      const xScale = scaleLinear()
        .domain([0, Math.sqrt(gridSize) + 1])
        .range([0, width]);
      const yScale = scaleLinear()
        .domain([0, Math.sqrt(gridSize) + 1])
        .range([width, 0]);

      svg
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('r', `${width / 25}`)
        .attr('cx', value => xScale(value.x))
        .attr('cy', value => yScale(value.y))
        .attr('stroke', 'none')
        .attr(
          'fill',
          `rgba(${brightness * 255}, ${brightness * 255}, ${brightness *
            255}, 1)`,
        );
    }
  }, [svgRef, width, data, brightness]);

  return (
    <React.Fragment>
      <svg ref={svgRef} className={styles.leds}></svg>
    </React.Fragment>
  );
}
