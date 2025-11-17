import axios from 'axios';
import { CircuitOperation, CircuitInfo, SimulationResult, MaxCutGraph } from './types';

const API_BASE = '/api';

export const api = {
  healthCheck: async () => {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  },

  createCircuit: async (numQubits: number) => {
    const response = await axios.post(`${API_BASE}/circuit/create`, {
      num_qubits: numQubits
    });
    return response.data;
  },

  buildCircuit: async (numQubits: number, operations: CircuitOperation[]) => {
    const response = await axios.post(`${API_BASE}/circuit/build`, {
      num_qubits: numQubits,
      operations: operations
    });
    return response.data;
  },

  simulateCircuit: async (
    numQubits: number,
    operations: CircuitOperation[],
    shots: number = 1024
  ): Promise<{
    success: boolean;
    counts: SimulationResult[];
    circuit_info: CircuitInfo;
  }> => {
    const response = await axios.post(`${API_BASE}/circuit/simulate`, {
      num_qubits: numQubits,
      operations: operations,
      shots: shots
    });
    return response.data;
  },

  createMaxCutGraph: async (numNodes: number, edgeProbability: number = 0.5): Promise<{
    success: boolean;
    num_nodes: number;
    edges: [number, number][];
  }> => {
    const response = await axios.post(`${API_BASE}/maxcut/graph`, {
      num_nodes: numNodes,
      edge_probability: edgeProbability
    });
    return response.data;
  }
};
