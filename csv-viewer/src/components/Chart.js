import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Chart({ data, column }) {
  const chartRef = useRef();

  useEffect(() => {
    if (data.length > 0 && column) {
      createChart();
    }
  }, [data, column]);

  const createChart = () => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(data.map(d => d[column]));
    y.domain([0, d3.max(data, d => +d[column])]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[column]))
      .attr('y', d => y(+d[column]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(+d[column]));
  };

  return <svg ref={chartRef} width="400" height="300"></svg>;
}