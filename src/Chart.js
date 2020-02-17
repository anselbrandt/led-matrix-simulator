import React, { useEffect } from 'react';
import styles from './App.module.css';
import {
  select,
  line,
  scaleLinear,
  axisBottom,
  axisLeft,
  curveCardinal,
} from 'd3';

export default function Chart(props) {
  const {
    svgRef,
    width,
    height,
    domain,
    range,
    expected,
    variance,
    timer,
    gaussian,
    yMax,
  } = props;

  useEffect(() => {
    if (
      svgRef &&
      width &&
      height &&
      domain &&
      range &&
      expected &&
      variance &&
      yMax
    ) {
      function values(length, domain) {
        return [...Array(length + 1).keys()].map(value => {
          return (domain / length) * value;
        });
      }

      const svg = select(svgRef.current);
      svg.attr('width', `${width}px`).attr('height', `${height}px`);

      const xScale = scaleLinear()
        .domain(domain)
        .range([0, width]);
      const yScale = scaleLinear()
        .domain(range)
        .range([height, 0]);

      const xAxis = axisBottom(xScale).ticks('11');
      svg
        .select(`.${styles.xAxis}`)
        .style('transform', `translateY(${height}px)`)
        .call(xAxis);
      const yAxis = axisLeft(yScale).ticks(2);
      svg.select(`.${styles.yAxis}`).call(yAxis);

      const lineChart = () =>
        line()
          .x(value => xScale(value))
          .y(value => yScale(gaussian(value, expected, variance)))
          .curve(curveCardinal);
      const scaled = () =>
        line()
          .x(value => xScale(value))
          .y(value => yScale(gaussian(value, expected, variance) / yMax))
          .curve(curveCardinal);

      function svgLine(data, mappingFunction, name) {
        svg
          .selectAll(`.${name}`)
          .data([data])
          .join('path')
          .attr('class', `${name}`)
          .attr('d', mappingFunction)
          .attr('fill', 'none')
          .attr('stroke', 'tomato')
          .attr('stroke-width', '4');
      }
      svgLine(values(100, domain[1]), lineChart(), 'line');
      svgLine(values(100, domain[1]), scaled(), 'scaled');

      function cursor(cursorPosition) {
        svg.selectAll('.cursor').remove();
        svg
          .append('line')
          .attr('class', `cursor`)
          .attr('x1', xScale(cursorPosition))
          .attr('x2', xScale(cursorPosition))
          .attr('y1', yScale(0))
          .attr('y2', yScale(1))
          .attr('fill', 'none')
          .attr('stroke', 'grey')
          .attr('stroke-width', '2');
      }
      cursor(timer / 1000);
    }
  }, [
    svgRef,
    width,
    height,
    domain,
    range,
    expected,
    variance,
    timer,
    gaussian,
    yMax,
  ]);

  return (
    <React.Fragment>
      <svg ref={svgRef} className={styles.chart}>
        <g className={styles.xAxis} />
        <g className={styles.yAxis} />
      </svg>
    </React.Fragment>
  );
}
