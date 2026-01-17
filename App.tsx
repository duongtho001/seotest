import React, { useState } from 'react';
import { Search, Loader2, Globe, AlertCircle, PlayCircle } from 'lucide-react';
import { analyzeUrl, getDemoData } from './services/api';
import { AnalysisResult } from './types';
import { MetaSection } from './components/MetaSection';
import { KeywordDensitySection } from './components/KeywordDensity.tsx';
import { SpeedGauge } from './components/SpeedGauge';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Basic validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err) {
      // If backend fails, allow user to see demo data
      setError(`Could not connect to analysis server. Ensure the backend (index.js) is running on port 3001.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setUrl("https://example.com");
    try {
      const data = await getDemoData();
      setResult(data);
    } catch (err) {
      setError("Demo failed loading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">SEO Page Auditor</h1>
          </div>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            Documentation
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-10">
        {/* Search Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Optimize your content for Search Engines</h2>
          <p className="text-slate-500 mb-8">Enter a URL to analyze on-page SEO factors like meta tags, headers, and keyword density.</p>
          
          <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto relative flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-4 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </button>
          </form>

          {!result && !loading && (
             <button onClick={handleDemo} className="mt-4 text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1 mx-auto">
               <PlayCircle className="w-4 h-4" /> Run with Demo Data
             </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl bg-red-50 p-4 mb-8 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              {error.includes('backend') && (
                 <button onClick={handleDemo} className="mt-3 text-sm bg-white text-red-700 border border-red-200 px-3 py-1 rounded shadow-sm hover:bg-red-50 font-medium">
                   Try Demo Mode Instead
                 </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Speed & Overview Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="md:col-span-1">
                  <SpeedGauge loadTime={result.loadTime} />
               </div>
               <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Analyzing Target</h3>
                  <div className="text-xl font-medium text-slate-800 truncate" title={result.url}>
                    {result.url}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Analyzed at {new Date(result.timestamp).toLocaleString()}
                  </div>
               </div>
            </div>

            <MetaSection data={result.meta} />
            <KeywordDensitySection data={result.density} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;