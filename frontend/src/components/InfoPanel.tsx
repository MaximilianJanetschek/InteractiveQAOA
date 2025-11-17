import { MaxCutGraph, SimulationResult } from '../types';
import ProbabilityHistogram from './ProbabilityHistogram';
import GraphVisualization from './GraphVisualization';

interface MixerLayer {
  position: number;
  qubits: number[];
  parameter: number;
}

interface CostLayer {
  position: number;
  edges: [number, number][];
  parameter: number;
}

interface ZZGate {
  qubit1: number;
  qubit2: number;
  parameter: number;
}

interface InfoPanelProps {
  mixerLayers: MixerLayer[];
  costLayers: CostLayer[];
  zzGates: ZZGate[];
  maxCutGraph: MaxCutGraph | null;
  simulationResults: SimulationResult[];
}

const InfoPanel = ({
  mixerLayers,
  costLayers,
  zzGates,
  maxCutGraph,
  simulationResults
}: InfoPanelProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue">Circuit Information</h2>

      {/* Graph Visualization */}
      {maxCutGraph && <GraphVisualization graph={maxCutGraph} />}

      {/* Max-Cut Graph Edge List */}
      {maxCutGraph && (
        <div className="bg-muted/50 rounded-md border border-border p-4">
          <h3 className="text-sm font-bold text-purple mb-2">Edge List</h3>
          <div className="max-h-32 overflow-y-auto text-xs font-mono text-blue space-y-1">
            {maxCutGraph.edges.map((edge, i) => (
              <div key={i}>
                ({edge[0]}, {edge[1]})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mixer Layers */}
      <div className="bg-muted/50 rounded-md border border-border p-4">
        <h3 className="text-sm font-bold text-purple mb-2">Mixer Layers (X)</h3>
        {mixerLayers.length > 0 ? (
          <div className="space-y-2">
            {mixerLayers.map((layer, i) => (
              <div key={i} className="text-xs">
                <p className="text-muted-foreground">
                  Layer {i + 1}:
                </p>
                <p className="text-blue font-mono">
                  Qubits: [{layer.qubits.join(', ')}]
                </p>
                <p className="text-purple">
                  β = {layer.parameter.toFixed(3)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No mixer layers added</p>
        )}
      </div>

      {/* Cost Layers */}
      <div className="bg-muted/50 rounded-md border border-border p-4">
        <h3 className="text-sm font-bold text-teal mb-2">Cost Hamiltonian</h3>
        {costLayers.length > 0 ? (
          <div className="space-y-2">
            {costLayers.map((layer, i) => (
              <div key={i} className="text-xs">
                <p className="text-muted-foreground">
                  Layer {i + 1}:
                </p>
                <p className="text-teal">
                  γ = {layer.parameter.toFixed(3)}
                </p>
                <p className="text-muted-foreground">
                  Edges: {layer.edges.length} interactions
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No cost layers added</p>
        )}
      </div>

      {/* Manual ZZ Gates */}
      {zzGates.length > 0 && (
        <div className="bg-muted/50 rounded-md border border-border p-4">
          <h3 className="text-sm font-bold text-light-orange mb-2">Manual ZZ Gates</h3>
          <div className="space-y-1">
            {zzGates.map((gate, i) => (
              <div key={i} className="text-xs">
                <p className="text-foreground font-mono">
                  q[{gate.qubit1}] ↔ q[{gate.qubit2}]
                </p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              γ = {zzGates[0]?.parameter.toFixed(3)}
            </p>
          </div>
        </div>
      )}

      {/* Simulation Results with Histogram */}
      {simulationResults.length > 0 && (
        <ProbabilityHistogram
          results={simulationResults}
          totalShots={simulationResults.reduce((sum, r) => sum + r.count, 0)}
        />
      )}
    </div>
  );
};

export default InfoPanel;
