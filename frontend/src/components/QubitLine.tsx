import { useDrop } from 'react-dnd';
import { Gate } from '../types';
import GateComponent from './GateComponent';

interface QubitLineProps {
  qubitIndex: number;
  gates: Gate[];
  onAddGate: (gate: Gate) => void;
  onRemoveGate: (gateId: string) => void;
  onUpdateGate: (gateId: string, updates: Partial<Gate>) => void;
}

const QubitLine = ({
  qubitIndex,
  gates,
  onAddGate,
  onRemoveGate,
  onUpdateGate
}: QubitLineProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['mixer', 'cost'],
    drop: (item: { type: 'mixer' | 'cost' }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        // Calculate position along the line
        const position = gates.length;

        const newGate: Gate = {
          id: `${item.type}-${qubitIndex}-${Date.now()}`,
          type: item.type,
          qubitIndex,
          position,
          parameter: Math.PI / 4
        };

        onAddGate(newGate);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [gates, qubitIndex]);

  return (
    <div className="flex items-center gap-4">
      {/* Qubit Label */}
      <div className="w-16 text-right">
        <span className="text-blue font-mono text-sm">
          q[{qubitIndex}]
        </span>
      </div>

      {/* Qubit Line */}
      <div
        ref={drop}
        className={`flex-1 h-12 relative border-t-2 transition-colors ${
          isOver ? 'border-blue' : 'border-border'
        }`}
      >
        {/* Initial State */}
        <div className="absolute -left-3 -top-3 w-6 h-6 bg-blue rounded-full flex items-center justify-center text-xs text-white">
          |0⟩
        </div>

        {/* Gates */}
        <div className="flex items-center h-full gap-2 pl-8">
          {gates
            .sort((a, b) => a.position - b.position)
            .map((gate) => (
              <GateComponent
                key={gate.id}
                gate={gate}
                onRemove={() => onRemoveGate(gate.id)}
                onUpdate={(updates) => onUpdateGate(gate.id, updates)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default QubitLine;
