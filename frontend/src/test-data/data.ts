import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

export interface Node extends SimulationNodeDatum {
  id: string;
  group: string;
  occurrences: number;
}

export interface Link extends SimulationLinkDatum<Node> {
  value: number;
  strength: number;
}

export type Data = {
  nodes: Node[];
  links: Link[];
};

