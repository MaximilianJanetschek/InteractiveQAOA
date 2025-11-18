interface ProbabilityHistogramProps {
  results: Array<{ state: string; count: number; objective_value: number }>;
  totalShots: number;
}

const ProbabilityHistogram = ({ results, totalShots }: ProbabilityHistogramProps) => {
  if (results.length === 0) return null;

  const maxCount = Math.max(...results.map(r => r.count));
  const topResults = results.slice(0, 10);

  // Find optimal (most probable) state
  const optimalState = results[0];

  // Find the best objective value among all results
  const maxObjectiveValue = Math.max(...results.map(r => r.objective_value));

  return (
    <div className="bg-muted/50 rounded-md border border-border p-4">
      <h3 className="text-sm font-bold text-teal mb-3">Measurement Probabilities</h3>

      <div className="space-y-2">
        {topResults.map((result, i) => {
          const probability = result.count / totalShots;
          const barWidth = (result.count / maxCount) * 100;
          const isOptimal = i === 0;
          const isBestCut = result.objective_value === maxObjectiveValue;

          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-mono ${isOptimal ? 'text-teal font-bold' : 'text-blue'}`}>
                    {result.state} {isOptimal && '★'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    isBestCut
                      ? 'bg-teal/20 text-teal border border-teal/30'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {result.objective_value} {isBestCut ? 'cuts' : 'cut'}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {(probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-3xs h-4 overflow-hidden">
                <div
                  className={`h-full ${isOptimal ? 'bg-teal' : 'bg-blue'} transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {results.length > 10 && (
        <p className="text-xs text-muted-foreground mt-3">
          Showing top 10 of {results.length} states
        </p>
      )}

      <div className="mt-4 p-3 bg-teal/10 rounded-2xs border border-teal/30">
        <p className="text-xs font-bold text-teal mb-1">Optimal Solution</p>
        <p className="text-sm font-mono text-foreground">{optimalState.state}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Probability: {((optimalState.count / totalShots) * 100).toFixed(2)}% | Edges cut: {optimalState.objective_value}
        </p>
      </div>
    </div>
  );
};

export default ProbabilityHistogram;
