export interface Gate {
  id: string;
  type: 'mixer' | 'cost' | 'zz';
  qubitIndex: number;
  position: number; // Position along the qubit line
  parameter?: number;
  edges?: [number, number][]; // For cost gates (edges in the graph)
  targetQubit?: number; // For ZZ gates - the other qubit to interact with
}

export interface CircuitOperation {
  type: 'mixer' | 'cost' | 'zz';
  qubits?: number[] | null;
  edges?: [number, number][];
  parameter: number;
  targetQubit?: number;
}

export interface CircuitInfo {
  num_qubits: number;
  depth: number;
  num_gates: number;
  mixer_layers: Array<{
    qubits: number[];
    parameter: number;
  }>;
  cost_layers: Array<{
    edges: [number, number][];
    parameter: number;
  }>;
}

export interface SimulationResult {
  state: string;
  count: number;
}

export interface MaxCutGraph {
  num_nodes: number;
  edges: [number, number][];
}
