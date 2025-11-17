import { useDrop } from 'react-dnd';
import QubitLine from './QubitLine';
import { Gate } from '../types';

interface CircuitCanvasProps {
  numQubits: number;
  gates: Gate[];
  onAddGate: (gate: Gate) => void;
  onRemoveGate: (gateId: string) => void;
  onUpdateGate: (gateId: string, updates: Partial<Gate>) => void;
}

const CircuitCanvas = ({
  numQubits,
  gates,
  onAddGate,
  onRemoveGate,
  onUpdateGate
}: CircuitCanvasProps) => {
  return (
    <div className="bg-muted/50 rounded-md border border-border p-8 min-h-[500px]">
      <div className="space-y-4">
        {/* Qubit Lines */}
        {Array.from({ length: numQubits }, (_, i) => (
          <QubitLine
            key={i}
            qubitIndex={i}
            gates={gates.filter(g => g.qubitIndex === i)}
            onAddGate={onAddGate}
            onRemoveGate={onRemoveGate}
            onUpdateGate={onUpdateGate}
          />
        ))}
      </div>

      {/* Helper Text */}
      {gates.length === 0 && (
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-lg">Drag and drop gates from the toolbox onto the qubit lines</p>
          <p className="text-sm mt-2">Start by generating a Max-Cut graph, then add mixer and cost layers</p>
        </div>
      )}
    </div>
  );
};

export default CircuitCanvas;
