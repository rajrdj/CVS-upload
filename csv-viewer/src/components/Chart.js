import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChordDiagram = ({ data, column }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0 || !column) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 600;
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Process data for the chord diagram
    const uniqueValues = Array.from(new Set(data.map(d => d[column])));
    const matrix = [];
    for (let i = 0; i < uniqueValues.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < uniqueValues.length; j++) {
        matrix[i][j] = i === j ? 0 : 1; // Simple connection, adjust as needed
      }
    }

    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const chords = chord(matrix);

    const group = svg.append("g")
      .selectAll("g")
      .data(chords.groups)
      .join("g");

    group.append("path")
      .attr("fill", d => d3.schemeCategory10[d.index])
      .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius));

    group.append("text")
      .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr("dy", "0.35em")
      .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 5})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => uniqueValues[d.index]);

    svg.append("g")
      .attr("fill-opacity", 0.67)
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("d", d3.ribbon().radius(innerRadius))
      .attr("fill", d => d3.schemeCategory10[d.source.index])
      .append("title")
      .text(d => `${uniqueValues[d.source.index]} → ${uniqueValues[d.target.index]}`);

  }, [data, column]);

  return <svg ref={svgRef}></svg>;
};

export default ChordDiagram;