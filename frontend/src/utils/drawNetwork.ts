import { Link, Node } from '../test-data/data';

export const RADIUS = 10;

export const drawNetwork = (context: CanvasRenderingContext2D, width: number, height: number, nodes: Node[], links: Link[]) => {
  context.clearRect(0, 0, width, height);

  // Draw the links first
  links.forEach((link: Link) => {
    // check if the link is already a proper object with coordinates to draw to
    if (
      typeof link.source === 'object' &&
      typeof link.source.x === 'number' &&
      typeof link.source.y === 'number' &&
      typeof link.target === 'object' &&
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
