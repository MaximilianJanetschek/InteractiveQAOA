import { MaxCutGraph, SimulationResult } from '../types';

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

interface InfoPanelProps {
  mixerLayers: MixerLayer[];
  costLayers: CostLayer[];
  maxCutGraph: MaxCutGraph | null;
  simulationResults: SimulationResult[];
}

const InfoPanel = ({
  mixerLayers,
  costLayers,
  maxCutGraph,
  simulationResults
}: InfoPanelProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue">Circuit Information</h2>

      {/* Max-Cut Graph */}
      <div className="bg-muted/50 rounded-md border border-border p-4">
        <h3 className="text-sm font-bold text-purple mb-2">Max-Cut Graph</h3>
        {maxCutGraph ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Nodes: <span className="text-foreground">{maxCutGraph.num_nodes}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Edges: <span className="text-foreground">{maxCutGraph.edges.length}</span>
            </p>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Edge List:</p>
              <div className="max-h-32 overflow-y-auto text-xs font-mono text-blue">
                {maxCutGraph.edges.map((edge, i) => (
                  <div key={i}>
                    ({edge[0]}, {edge[1]})
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No graph generated yet</p>
        )}
      </div>

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

      {/* Simulation Results */}
      {simulationResults.length > 0 && (
        <div className="bg-muted/50 rounded-md border border-border p-4">
          <h3 className="text-sm font-bold text-teal mb-2">Simulation Results</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {simulationResults.slice(0, 10).map((result, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="font-mono text-blue">{result.state}</span>
                <span className="text-muted-foreground">{result.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
