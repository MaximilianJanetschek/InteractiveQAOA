import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CircuitCanvas from './components/CircuitCanvas';
import GateToolbox from './components/GateToolbox';
import InfoPanel from './components/InfoPanel';
import ControlPanel from './components/ControlPanel';
import { Gate, CircuitOperation, SimulationResult, MaxCutGraph } from './types';
import { api } from './api';

function App() {
  const [numQubits, setNumQubits] = useState(4);
  const [numLayers, setNumLayers] = useState(1); // Number of QAOA layers (p)
  const [gates, setGates] = useState<Gate[]>([]);
  const [maxCutGraph, setMaxCutGraph] = useState<MaxCutGraph | null>(null);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [globalBeta, setGlobalBeta] = useState(Math.PI / 4); // β for mixer
  const [globalGamma, setGlobalGamma] = useState(Math.PI / 4); // γ for cost

  const handleAddGate = (gate: Gate) => {
    setGates([...gates, gate]);
  };

  const handleRemoveGate = (gateId: string) => {
    setGates(gates.filter(g => g.id !== gateId));
  };

  const handleUpdateGate = (gateId: string, updates: Partial<Gate>) => {
    setGates(gates.map(g => g.id === gateId ? { ...g, ...updates } : g));
  };

  const handleGenerateGraph = async () => {
    try {
      const result = await api.createMaxCutGraph(numQubits, 0.5);
      if (result.success) {
        setMaxCutGraph({
          num_nodes: result.num_nodes,
          edges: result.edges
        });
      }
    } catch (error) {
      console.error('Error generating graph:', error);
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      // Convert gates to operations
      const operations: CircuitOperation[] = [];

      // Group mixer gates by position
      const mixerGates = gates.filter(g => g.type === 'mixer');
      const mixerByPosition = new Map<number, Gate[]>();

      mixerGates.forEach(gate => {
        if (!mixerByPosition.has(gate.position)) {
          mixerByPosition.set(gate.position, []);
        }
        mixerByPosition.get(gate.position)!.push(gate);
      });

      // Add mixer operations (use global beta parameter)
      Array.from(mixerByPosition.entries())
        .sort((a, b) => a[0] - b[0])
        .forEach(([_, gatesAtPosition]) => {
          operations.push({
            type: 'mixer',
            qubits: gatesAtPosition.map(g => g.qubitIndex),
            parameter: globalBeta
          });
        });

      // Group cost gates by position
      const costGates = gates.filter(g => g.type === 'cost');
      const costByPosition = new Map<number, Gate[]>();

      costGates.forEach(gate => {
        if (!costByPosition.has(gate.position)) {
          costByPosition.set(gate.position, []);
        }
        costByPosition.get(gate.position)!.push(gate);
      });

      // Add cost operations (use global gamma parameter)
      Array.from(costByPosition.entries())
        .sort((a, b) => a[0] - b[0])
        .forEach(([_, gatesAtPosition]) => {
          const edges = maxCutGraph?.edges || [];
          operations.push({
            type: 'cost',
            edges: edges,
            parameter: globalGamma
          });
        });

      // Add individual ZZ gate operations (use global gamma parameter)
      const zzGates = gates.filter(g => g.type === 'zz');
      zzGates.forEach(gate => {
        if (gate.targetQubit !== undefined && gate.targetQubit !== gate.qubitIndex) {
          operations.push({
            type: 'zz',
            qubits: [gate.qubitIndex, gate.targetQubit],
            parameter: globalGamma
          });
        }
      });

      const result = await api.simulateCircuit(numQubits, operations, 1024);

      if (result.success) {
        setSimulationResults(result.counts);
      }
    } catch (error) {
      console.error('Error simulating circuit:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClear = () => {
    setGates([]);
    setSimulationResults([]);
  };

  const handleBuildLayers = () => {
    // Automatically build p layers of alternating cost and mixer gates
    const newGates: Gate[] = [];
    let gateId = 0;

    for (let layer = 0; layer < numLayers; layer++) {
      // Add cost layer for all qubits
      for (let q = 0; q < numQubits; q++) {
        newGates.push({
          id: `cost-${q}-${layer}-${gateId++}`,
          type: 'cost',
          qubitIndex: q,
          position: layer * 2, // Even positions for cost
          parameter: globalGamma
        });
      }

      // Add mixer layer for all qubits
      for (let q = 0; q < numQubits; q++) {
        newGates.push({
          id: `mixer-${q}-${layer}-${gateId++}`,
          type: 'mixer',
          qubitIndex: q,
          position: layer * 2 + 1, // Odd positions for mixer
          parameter: globalBeta
        });
      }
    }

    setGates(newGates);
  };

  const handleExport = () => {
    const exportData = {
      numQubits,
      gates,
      maxCutGraph,
      mixerLayers: getMixerLayers(),
      costLayers: getCostLayers(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qaoa-circuit-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getMixerLayers = () => {
    const mixerGates = gates.filter(g => g.type === 'mixer');
    const layers = new Map<number, number[]>();

    mixerGates.forEach(gate => {
      if (!layers.has(gate.position)) {
        layers.set(gate.position, []);
      }
      layers.get(gate.position)!.push(gate.qubitIndex);
    });

    return Array.from(layers.entries()).map(([position, qubits]) => ({
      position,
      qubits,
      parameter: globalBeta
    }));
  };

  const getCostLayers = () => {
    const costGates = gates.filter(g => g.type === 'cost');
    const layers = new Map<number, any>();

    costGates.forEach(gate => {
      if (!layers.has(gate.position)) {
        layers.set(gate.position, {
          position: gate.position,
          edges: maxCutGraph?.edges || [],
          parameter: globalGamma
        });
      }
    });

    return Array.from(layers.values());
  };

  const getZZGates = () => {
    return gates.filter(g => g.type === 'zz').map(gate => ({
      qubit1: gate.qubitIndex,
      qubit2: gate.targetQubit || 0,
      parameter: globalGamma
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-muted/50 backdrop-blur-sm border-b border-border px-6 py-4">
          <h1 className="text-h4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue to-purple">
            Interactive QAOA Circuit Designer
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Build quantum circuits for Max-Cut optimization problems
          </p>
        </header>

        <div className="flex h-[calc(100vh-5rem)]">
          {/* Left Sidebar - Toolbox */}
          <div className="w-64 bg-muted/30 backdrop-blur-sm border-r border-border p-4">
            <GateToolbox />
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Control Panel */}
            <ControlPanel
              numQubits={numQubits}
              numLayers={numLayers}
              onNumQubitsChange={setNumQubits}
              onNumLayersChange={setNumLayers}
              globalBeta={globalBeta}
              globalGamma={globalGamma}
              onBetaChange={setGlobalBeta}
              onGammaChange={setGlobalGamma}
              onBuildLayers={handleBuildLayers}
              onGenerateGraph={handleGenerateGraph}
              onSimulate={handleSimulate}
              onClear={handleClear}
              onExport={handleExport}
              isSimulating={isSimulating}
              hasGraph={!!maxCutGraph}
            />

            {/* Circuit Canvas */}
            <div className="flex-1 overflow-auto p-6">
              <CircuitCanvas
                numQubits={numQubits}
                gates={gates}
                onAddGate={handleAddGate}
                onRemoveGate={handleRemoveGate}
                onUpdateGate={handleUpdateGate}
              />
            </div>
          </div>

          {/* Right Sidebar - Info Panel */}
          <div className="w-96 bg-muted/30 backdrop-blur-sm border-l border-border p-4 overflow-y-auto">
            <InfoPanel
              mixerLayers={getMixerLayers()}
              costLayers={getCostLayers()}
              zzGates={getZZGates()}
              maxCutGraph={maxCutGraph}
              simulationResults={simulationResults}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
