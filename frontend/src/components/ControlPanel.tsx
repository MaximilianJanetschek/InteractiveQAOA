interface ControlPanelProps {
  numQubits: number;
  onNumQubitsChange: (num: number) => void;
  globalBeta: number;
  globalGamma: number;
  onBetaChange: (beta: number) => void;
  onGammaChange: (gamma: number) => void;
  onGenerateGraph: () => void;
  onSimulate: () => void;
  onClear: () => void;
  onExport: () => void;
  isSimulating: boolean;
  hasGraph: boolean;
}

const ControlPanel = ({
  numQubits,
  onNumQubitsChange,
  globalBeta,
  globalGamma,
  onBetaChange,
  onGammaChange,
  onGenerateGraph,
  onSimulate,
  onClear,
  onExport,
  isSimulating,
  hasGraph
}: ControlPanelProps) => {
  return (
    <div className="bg-muted/30 backdrop-blur-sm border-b border-border px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Number of Qubits */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground">Qubits:</label>
          <input
            type="number"
            min="2"
            max="8"
            value={numQubits}
            onChange={(e) => onNumQubitsChange(parseInt(e.target.value))}
            className="w-16 px-2 py-1 bg-input border border-border rounded-2xs text-foreground text-sm"
          />
        </div>

        {/* Beta Parameter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-purple">β (mixer):</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max={2 * Math.PI}
            value={globalBeta.toFixed(3)}
            onChange={(e) => onBetaChange(parseFloat(e.target.value))}
            className="w-20 px-2 py-1 bg-input border border-border rounded-2xs text-foreground text-sm"
          />
        </div>

        {/* Gamma Parameter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-teal">γ (cost):</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max={2 * Math.PI}
            value={globalGamma.toFixed(3)}
            onChange={(e) => onGammaChange(parseFloat(e.target.value))}
            className="w-20 px-2 py-1 bg-input border border-border rounded-2xs text-foreground text-sm"
          />
        </div>

        {/* Generate Graph Button */}
        <button
          onClick={onGenerateGraph}
          className="px-4 py-2 bg-blue hover:opacity-80 text-white rounded-sm text-sm font-medium transition-opacity"
        >
          Generate Graph
        </button>

        {/* Simulate Button */}
        <button
          onClick={onSimulate}
          disabled={!hasGraph || isSimulating}
          className={`px-4 py-2 rounded-sm text-sm font-medium transition-opacity ${
            hasGraph && !isSimulating
              ? 'bg-purple hover:opacity-80 text-white'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="px-4 py-2 bg-teal hover:opacity-80 text-white rounded-sm text-sm font-medium transition-opacity"
        >
          Export
        </button>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red hover:opacity-80 text-white rounded-sm text-sm font-medium transition-opacity"
        >
          Clear
        </button>

        {/* Status */}
        <div className="ml-auto flex items-center gap-2">
          {hasGraph && (
            <span className="text-xs text-teal flex items-center gap-1">
              <span className="w-2 h-2 bg-teal rounded-full"></span>
              Graph Ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
