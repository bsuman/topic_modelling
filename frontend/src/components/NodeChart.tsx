import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Connection {
  source: string;
  target: string;
}

interface NodeChartProps {
  nodes: Node[];
  connections: Connection[];
}

const NodeChart: React.FC<NodeChartProps> = ({ nodes, connections }) => {
  const chartRef = useRef<any | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Clear previous chart content
      d3.select(chartRef.current).selectAll('*').remove();

      const width = 500;
      const height = 300;

      const svg = d3
        .select(chartRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Create the connections
      const links = svg
        .selectAll('line')
        .data(connections)
        .enter()
        .append('line')
        .attr('stroke', 'black');

      // Create the nodes
      const nodesGroup = svg.selectAll('circle').data(nodes).enter().append('g');

      nodesGroup
        .append('circle')
        .attr('r', 10)
        .attr('fill', 'blue')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);

      nodesGroup
        .append('text')
        .text((d) => d.id)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white');

      // Create the force simulation
      const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink<Node, Connection>(connections).id((d) => d.id))
        .force('center', d3.forceCenter(width / 2, height / 2));

      // Update the positions of the nodes and connections on each tick
      const tick = () => {
        links
          .attr('x1', (d) => {
            const sourceNode = nodes.find((node) => node.id === d.source);
            return sourceNode ? sourceNode.x : 0;
          })
          .attr('y1', (d) => {
            const sourceNode = nodes.find((node) => node.id === d.source);
            return sourceNode ? sourceNode.y : 0;
          })
          .attr('x2', (d) => {
            const targetNode = nodes.find((node) => node.id === d.target);
            return targetNode ? targetNode.x : 0;
          })
          .attr('y2', (d) => {
            const targetNode = nodes.find((node) => node.id === d.target);
            return targetNode ? targetNode.y : 0;
          });

        nodesGroup
          .attr('transform', (d) => `translate(${d.x},${d.y})`);
      };

      simulation.nodes(nodes).on('tick', tick);

      // @ts-expect-error
      simulation.force('link').links(connections);

      // Restart the simulation to apply the changes
      simulation.restart();
    }
  }, [nodes, connections]);

  return <div ref={chartRef}></div>;
};

export default NodeChart;
