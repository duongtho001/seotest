import React from 'react';
import { Zap } from 'lucide-react';

interface Props {
  loadTime: number; // ms
}

export const SpeedGauge: React.FC<Props> = ({ loadTime }) => {
  let grade = 'Fast';
  let colorClass = 'text-green-600 bg-green-50 border-green-200';
  let barColor = 'bg-green-500';

  // Basic thresholds for TTFB/Load
  if (loadTime > 1500) {
    grade = 'Slow';
    colorClass = 'text-red-600 bg-red-50 border-red-200';
    barColor = 'bg-red-500';
  } else if (loadTime > 800) {
    grade = 'Average';
    colorClass = 'text-amber-600 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
  }

  // Calculate width percentage limited to 100%
  const widthPercent = Math.min((loadTime / 2000) * 100, 100);

  return (
    <div className={`p-6 rounded-xl border shadow-sm ${colorClass} flex flex-col items-center justify-center relative overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
        <div className={`h-full ${barColor} transition-all duration-1000 ease-out`} style={{ width: `${widthPercent}%` }}></div>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5" />
        <span className="font-semibold uppercase tracking-wider text-sm">Response Time</span>
      </div>
      
      <div className="text-4xl font-bold mb-1">
        {loadTime} <span className="text-lg font-medium opacity-70">ms</span>
      </div>
      
      <div className="px-3 py-1 rounded-full bg-white/50 text-xs font-bold uppercase tracking-wide">
        {grade}
      </div>
    </div>
  );
};