import { useState } from 'react';
import { Gate } from '../types';

interface GateComponentProps {
  gate: Gate;
  onRemove: () => void;
  onUpdate: (updates: Partial<Gate>) => void;
}

const GateComponent = ({ gate, onRemove, onUpdate }: GateComponentProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [targetQubit, setTargetQubit] = useState(gate.targetQubit?.toString() || '0');

  const handleTargetQubitSubmit = () => {
    const value = parseInt(targetQubit);
    if (!isNaN(value) && value >= 0) {
      onUpdate({ targetQubit: value });
    }
    setShowSettings(false);
  };

  const getGateColor = () => {
    if (gate.type === 'mixer') return 'bg-purple';
    if (gate.type === 'cost') return 'bg-teal';
    return 'bg-light-orange';
  };

  const getGateLabel = () => {
    if (gate.type === 'mixer') return 'RX';
    if (gate.type === 'cost') return 'CZ';
    return 'ZZ';
  };

  return (
    <div className="relative group">
      {/* Gate Box */}
      <div
        className={`${getGateColor()} rounded-3xs px-3 py-1 min-w-[60px] text-center cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={() => setShowSettings(!showSettings)}
      >
        <div className="text-white font-bold text-sm">{getGateLabel()}</div>
        {gate.type === 'zz' && gate.targetQubit !== undefined ? (
          <div className="text-white text-xs opacity-90">
            → q[{gate.targetQubit}]
          </div>
        ) : (
          <div className="text-white text-xs opacity-90">
            {gate.type === 'zz' ? 'click' : ''}
          </div>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>

      {/* Settings Popup for ZZ gate */}
      {showSettings && gate.type === 'zz' && (
        <div className="absolute top-full mt-2 bg-muted border border-border rounded-3xs p-2 z-10 shadow-lg">
          <label className="text-xs text-foreground block mb-1">Target Qubit:</label>
          <input
            type="number"
            step="1"
            min="0"
            max="7"
            value={targetQubit}
            onChange={(e) => setTargetQubit(e.target.value)}
            className="w-24 px-2 py-1 bg-input text-foreground rounded-3xs text-sm border border-border"
            autoFocus
          />
          <button
            onClick={handleTargetQubitSubmit}
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
