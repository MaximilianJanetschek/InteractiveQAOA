import { MaxCutGraph } from '../types';

interface GraphVisualizationProps {
  graph: MaxCutGraph;
}

const GraphVisualization = ({ graph }: GraphVisualizationProps) => {
  if (!graph || graph.num_nodes === 0) return null;

  const width = 300;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 30;

  // Position nodes in a circle
  const nodePositions = Array.from({ length: graph.num_nodes }, (_, i) => {
    const angle = (2 * Math.PI * i) / graph.num_nodes - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      id: i
    };
  });

  return (
    <div className="bg-muted/50 rounded-md border border-border p-4">
      <h3 className="text-sm font-bold text-purple mb-3">Graph Visualization</h3>

      <svg width={width} height={height} className="mx-auto">
        {/* Draw edges */}
        <g>
          {graph.edges.map((edge, i) => {
            const [from, to] = edge;
            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];

            return (
              <line
                key={i}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="hsl(var(--teal))"
                strokeWidth="2"
                opacity="0.6"
              />
            );
          })}
        </g>

        {/* Draw nodes */}
        <g>
          {nodePositions.map((pos) => (
            <g key={pos.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill="hsl(var(--purple))"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-white"
              >
                {pos.id}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        {graph.num_nodes} nodes, {graph.edges.length} edges
      </div>
    </div>
  );
};

export default GraphVisualization;
