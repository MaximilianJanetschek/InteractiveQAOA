import { useDrag } from 'react-dnd';

const DraggableGate = ({ type, label, color }: { type: string; label: string; color: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [type]);

  return (
    <div
      ref={drag}
      className={`${color} rounded-lg p-4 cursor-move hover:opacity-80 transition-opacity ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="text-white font-bold text-center">{label}</div>
    </div>
  );
};

const GateToolbox = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-blue mb-4">Gate Toolbox</h2>

      <div className="space-y-3">
        {/* Mixer Gate */}
        <div>
          <h3 className="text-sm text-muted-foreground mb-2">Mixer Layer</h3>
          <DraggableGate
            type="mixer"
            label="X Mixer (RX)"
            color="bg-purple"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Applies RX rotation to selected qubits
          </p>
        </div>

        {/* Cost Gate */}
        <div>
          <h3 className="text-sm text-muted-foreground mb-2">Cost Layer</h3>
          <DraggableGate
            type="cost"
            label="Cost (Max-Cut)"
            color="bg-teal"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Applies ZZ interactions based on graph edges
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-muted/30 rounded-md border border-border">
        <h3 className="text-sm font-bold text-blue mb-2">Instructions</h3>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Generate a Max-Cut graph</li>
          <li>Drag gates onto qubit lines</li>
          <li>Click gates to adjust parameters</li>
          <li>Run simulation to see results</li>
        </ol>
      </div>
    </div>
  );
};

export default GateToolbox;
