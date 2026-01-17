import React from 'react';
import { MetaData } from '../types';
import { TITLE_OPTIMAL_MIN, TITLE_OPTIMAL_MAX, DESC_OPTIMAL_MIN, DESC_OPTIMAL_MAX } from '../constants';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  data: MetaData;
}

const LengthIndicator: React.FC<{ length: number; min: number; max: number; label: string }> = ({ length, min, max, label }) => {
  let status: 'good' | 'warning' | 'bad' = 'good';
  let color = 'text-green-600 bg-green-50 border-green-200';
  let icon = <CheckCircle className="w-4 h-4 text-green-600" />;

  if (length === 0) {
    status = 'bad';
    color = 'text-red-600 bg-red-50 border-red-200';
    icon = <XCircle className="w-4 h-4 text-red-600" />;
  } else if (length < min || length > max) {
    status = 'warning';
    color = 'text-amber-600 bg-amber-50 border-amber-200';
    icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
  }

  return (
    <div className={`mt-2 p-3 rounded-md border flex items-center justify-between ${color}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">
          {length} characters
        </span>
      </div>
      <span className="text-xs opacity-80">
        Optimal: {min}-{max}
      </span>
    </div>
  );
};

const HeadingList: React.FC<{ tag: string; items: string[] }> = ({ tag, items }) => {
  const [isOpen, setIsOpen] = React.useState(items.length > 0 && tag === 'h1');

  if (items.length === 0) return null;

  return (
    <div className="mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full text-left p-2 hover:bg-slate-50 rounded text-sm font-semibold text-slate-700 transition-colors"
      >
        {isOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        <span className="uppercase mr-2">{tag}</span>
        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
      </button>
      
      {isOpen && (
        <ul className="pl-8 pr-2 py-1 space-y-1">
          {items.map((text, idx) => (
            <li key={idx} className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3 py-1">
              {text || <span className="italic text-slate-400">Empty tag</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const MetaSection: React.FC<Props> = ({ data }) => {
  // Cast arr to string[] because Object.values might be inferred as unknown[]
  const hasHeadings = Object.values(data.headings).some((arr) => (arr as string[]).length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Meta Tags */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          Meta Tags
        </h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Page Title</h4>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800 font-medium break-words">
            {data.title || <span className="text-slate-400 italic">No title found</span>}
          </div>
          <LengthIndicator 
            length={data.title.length} 
            min={TITLE_OPTIMAL_MIN} 
            max={TITLE_OPTIMAL_MAX} 
            label="Title" 
          />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Meta Description</h4>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-700 text-sm leading-relaxed break-words min-h-[80px]">
            {data.description || <span className="text-slate-400 italic">No description found</span>}
          </div>
          <LengthIndicator 
            length={data.description.length} 
            min={DESC_OPTIMAL_MIN} 
            max={DESC_OPTIMAL_MAX} 
            label="Description" 
          />
        </div>
      </div>

      {/* Headings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Headings Structure</h3>
        {hasHeadings ? (
          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {(Object.keys(data.headings) as Array<keyof typeof data.headings>).map(tag => (
              <HeadingList key={tag} tag={tag} items={data.headings[tag]} />
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-sm italic p-4 text-center bg-slate-50 rounded">
            No heading tags (H1-H6) found on this page.
          </div>
        )}
      </div>
    </div>
  );
};