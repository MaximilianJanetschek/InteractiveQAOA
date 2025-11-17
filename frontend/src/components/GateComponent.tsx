import { useState } from 'react';
import { Gate } from '../types';

interface GateComponentProps {
  gate: Gate;
  onRemove: () => void;
  onUpdate: (updates: Partial<Gate>) => void;
}

const GateComponent = ({ gate, onRemove, onUpdate }: GateComponentProps) => {
  const [showParameterInput, setShowParameterInput] = useState(false);
  const [paramValue, setParamValue] = useState(gate.parameter?.toString() || '0.785');

  const handleParameterSubmit = () => {
    const value = parseFloat(paramValue);
    if (!isNaN(value)) {
      onUpdate({ parameter: value });
    }
    setShowParameterInput(false);
  };

  const gateColor = gate.type === 'mixer' ? 'bg-purple' : 'bg-teal';
  const gateLabel = gate.type === 'mixer' ? 'RX' : 'CZ';

  return (
    <div className="relative group">
      {/* Gate Box */}
      <div
        className={`${gateColor} rounded-3xs px-3 py-1 min-w-[60px] text-center cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={() => setShowParameterInput(!showParameterInput)}
      >
        <div className="text-white font-bold text-sm">{gateLabel}</div>
        <div className="text-white text-xs opacity-90">
          {gate.parameter?.toFixed(3) || '0.785'}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>

      {/* Parameter Input */}
      {showParameterInput && (
        <div className="absolute top-full mt-2 bg-muted border border-border rounded-3xs p-2 z-10 shadow-lg">
          <input
            type="number"
            step="0.1"
            value={paramValue}
            onChange={(e) => setParamValue(e.target.value)}
            className="w-24 px-2 py-1 bg-input text-foreground rounded-3xs text-sm border border-border"
            autoFocus
          />
          <button
            onClick={handleParameterSubmit}
            className="ml-2 px-2 py-1 bg-blue text-white rounded-3xs text-sm hover:opacity-80"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
};

export default GateComponent;
