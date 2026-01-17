import React from 'react';
import { KeywordDensity } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: KeywordDensity;
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

const DensityTable: React.FC<{ title: string; items: any[] }> = ({ title, items }) => (
  <div className="flex-1 min-w-[300px]">
    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{title}</h4>
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phrase</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Count</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Density</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {items.slice(0, 5).map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="px-4 py-2 text-sm font-medium text-slate-800 truncate max-w-[120px]" title={item.phrase}>
                {item.phrase}
              </td>
              <td className="px-4 py-2 text-sm text-slate-600 text-right">{item.count}</td>
              <td className="px-4 py-2 text-sm text-slate-600 text-right">{item.density.toFixed(2)}%</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400 italic">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export const KeywordDensitySection: React.FC<Props> = ({ data }) => {
  const topSingleWords = data.single.slice(0, 8);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Keyword Density Analysis</h3>
      
      {/* Chart Section */}
      <div className="mb-8 h-[250px] w-full">
        <h4 className="text-sm font-semibold text-slate-500 mb-2">Top Single Keywords</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topSingleWords} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="phrase" 
              width={100} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {topSingleWords.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables Section */}
      <div className="flex flex-wrap gap-6">
        <DensityTable title="Single Words" items={data.single} />
        <DensityTable title="2-Word Phrases" items={data.twoWord} />
        <DensityTable title="3-Word Phrases" items={data.threeWord} />
      </div>
    </div>
  );
};