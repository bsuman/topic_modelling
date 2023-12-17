import { Link, Node } from '../test-data/data';
import { SimulationNodeDatum } from 'd3-force';

export const RADIUS = 10;

export const drawNetwork = (context: CanvasRenderingContext2D, width: number, height: number, nodes: Node[], links: Link[]) => {
  context.clearRect(0, 0, width, height);

  // Draw the links first
  links.forEach((link: Link) => {
    if (
      instanceOfSimulationNodeDatum(link.source) &&
      typeof link.source.x === 'number' &&
      typeof link.source.y === 'number' &&
      instanceOfSimulationNodeDatum(link.target) &&
      typeof link.target.x === 'number' &&
      typeof link.target.y === 'number'
    ) {
      context.beginPath();
      context.moveTo(link.source.x, link.source.y);
      context.lineTo(link.target.x, link.target.y);
      context.stroke();
    }
  });

  // Draw the nodes
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle = '#ff69b4';
    context.fill();
  });
};

/**
 * check if Link is the correct object to draw lines from one node to another
 * @param object
 */
function instanceOfSimulationNodeDatum(object: any): object is SimulationNodeDatum {
  return 'member' in object;
}
