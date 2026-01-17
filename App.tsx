import React, { useState, useEffect } from 'react';
import {
  Search, Globe, Settings, X, Key, AlertCircle, CheckCircle,
  FileText, Hash, Lightbulb, Clock, ExternalLink, PlayCircle,
  Loader2, ChevronRight, Sparkles
} from 'lucide-react';
import {
  analyzeWithGemini,
  getDemoAnalysis,
  getApiKey,
  setApiKey,
  removeApiKey,
  SEOAnalysisResult
} from './services/geminiApi';

// Settings Modal Component
const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}> = ({ isOpen, onClose, apiKey, onSaveApiKey }) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    removeApiKey();
    onSaveApiKey('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Settings size={20} />
            Cài đặt API Key
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Gemini API Key</label>
            <input
              type={showKey ? "text" : "password"}
              className="form-input"
              placeholder="Nhập API Key của bạn..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <p className="form-hint">
              Lấy API Key miễn phí tại{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showKey}
              onChange={(e) => setShowKey(e.target.checked)}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Hiển thị API Key
            </span>
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClear}>
            Xóa Key
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

// Score Gauge Component
const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="card score-gauge">
      <div className="score-circle">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle className="score-circle-bg" cx="70" cy="70" r="54" />
          <circle
            className="score-circle-progress"
            cx="70"
            cy="70"
            r="54"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-value">
          <div className="score-number">{score}</div>
          <div className="score-label">SEO Score</div>
        </div>
      </div>
    </div>
  );
};

// Meta Info Card Component
const MetaInfoCard: React.FC<{ data: SEOAnalysisResult['meta'] }> = ({ data }) => {
  const getTitleStatus = (length: number) => {
    if (length >= 50 && length <= 60) return 'good';
    if (length >= 40 && length <= 70) return 'warning';
    return 'bad';
  };

  const getDescStatus = (length: number) => {
    if (length >= 150 && length <= 160) return 'good';
    if (length >= 120 && length <= 180) return 'warning';
    return 'bad';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <FileText size={18} />
          Meta Information
        </h3>
      </div>

      <div className="meta-item">
        <div className="meta-label">Title Tag</div>
        <div className="meta-value">{data.title || 'Không có title'}</div>
        <span className={`meta-length ${getTitleStatus(data.titleLength)}`}>
          {data.titleLength} ký tự
        </span>
      </div>

      <div className="meta-item">
        <div className="meta-label">Meta Description</div>
        <div className="meta-value">{data.description || 'Không có description'}</div>
        <span className={`meta-length ${getDescStatus(data.descriptionLength)}`}>
          {data.descriptionLength} ký tự
        </span>
      </div>
    </div>
  );
};

// Headings Card Component
const HeadingsCard: React.FC<{ headings: SEOAnalysisResult['meta']['headings'] }> = ({ headings }) => {
  const allHeadings = [
    ...headings.h1.map(h => ({ tag: 'H1', text: h })),
    ...headings.h2.map(h => ({ tag: 'H2', text: h })),
    ...headings.h3.map(h => ({ tag: 'H3', text: h })),
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Hash size={18} />
          Heading Structure
        </h3>
      </div>

      <div className="headings-list">
        {allHeadings.length > 0 ? (
          allHeadings.map((h, i) => (
            <div key={i} className="heading-item">
              <span className="heading-tag">{h.tag}</span>
              <span className="heading-text">{h.text}</span>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Hash size={32} />
            <p>Không tìm thấy heading</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Keywords Card Component
const KeywordsCard: React.FC<{ keywords: SEOAnalysisResult['keywords'] }> = ({ keywords }) => {
  const maxDensity = Math.max(...keywords.map(k => k.density), 1);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Sparkles size={18} />
          Keyword Density
        </h3>
      </div>

      <div className="keywords-table">
        <div className="keywords-header">
          <span>Keyword</span>
          <span style={{ textAlign: 'center' }}>Count</span>
          <span style={{ textAlign: 'right' }}>Density</span>
        </div>
        {keywords.slice(0, 8).map((kw, i) => (
          <div key={i} className="keyword-row">
            <span className="keyword-phrase">{kw.phrase}</span>
            <span className="keyword-count">{kw.count}</span>
            <div className="keyword-density">
              <div className="density-bar">
                <div
                  className="density-fill"
                  style={{ width: `${(kw.density / maxDensity) * 100}%` }}
                />
                <span className="density-value">{kw.density.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Suggestions Card Component
const SuggestionsCard: React.FC<{ suggestions: SEOAnalysisResult['suggestions'] }> = ({ suggestions }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'good': return <CheckCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'bad': return <X size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  return (
    <div className="card ai-suggestions">
      <div className="card-header">
        <h3 className="card-title">
          <Lightbulb size={18} />
          AI Suggestions
        </h3>
      </div>

      {suggestions.map((s, i) => (
        <div key={i} className="ai-suggestion-item">
          <div className={`suggestion-icon ${s.type}`}>
            {getIcon(s.type)}
          </div>
          <p className="suggestion-text">{s.message}</p>
        </div>
      ))}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SEOAnalysisResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState(getApiKey() || '');

  const hasApiKey = apiKey.length > 0;

  const handleSaveApiKey = (key: string) => {
    if (key) {
      setApiKey(key);
    }
    setApiKeyState(key);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError('Vui lòng nhập URL hợp lệ (ví dụ: https://example.com)');
      return;
    }

    if (!hasApiKey) {
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeWithGemini(url);
      setResult(data);
    } catch (err: any) {
      if (err.message === 'API_KEY_REQUIRED') {
        setError('Vui lòng cài đặt API Key để sử dụng.');
        setShowSettings(true);
      } else if (err.message === 'INVALID_API_KEY') {
        setError('API Key không hợp lệ. Vui lòng kiểm tra lại.');
        setShowSettings(true);
      } else {
        setError(err.message || 'Có lỗi xảy ra khi phân tích.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setUrl('https://example.com');

    try {
      const data = await getDemoAnalysis();
      setResult(data);
    } catch (err) {
      setError('Demo thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-mesh" />

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo-icon">
                <Globe />
              </div>
              <span className="logo-text">SEO Auditor</span>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-icon btn-ghost"
                onClick={() => setShowSettings(true)}
                title="Cài đặt API Key"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Powered by Gemini AI
          </div>
          <h1 className="hero-title">
            Phân tích <span>SEO</span> thông minh
          </h1>
          <p className="hero-subtitle">
            Nhập URL để phân tích SEO on-page bao gồm meta tags, headings, keyword density và nhận gợi ý cải thiện từ AI.
          </p>

          {/* Search Form */}
          <div className="search-container">
            <form className="search-form" onSubmit={handleAnalyze}>
              <div className="search-input-wrapper">
                <Search />
                <input
                  type="text"
                  className="search-input"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary search-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    Phân tích
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* API Key Notice */}
            {!hasApiKey ? (
              <div className="api-notice">
                <Key size={16} />
                <span>
                  Cần API Key để phân tích.{' '}
                  <a onClick={() => setShowSettings(true)}>Cài đặt ngay</a>
                </span>
              </div>
            ) : (
              <div className="api-notice success">
                <CheckCircle size={16} />
                <span>API Key đã được cài đặt</span>
              </div>
            )}

            {/* Demo Button */}
            {!result && !loading && (
              <button onClick={handleDemo} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                <PlayCircle size={16} />
                Xem Demo
              </button>
            )}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="error-container animate-fade-in">
            <AlertCircle className="error-icon" />
            <div className="error-content">
              <h3>Phân tích thất bại</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container animate-fade-in">
            <div className="loading-spinner" />
            <p className="loading-text">Đang phân tích trang web với Gemini AI...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <section className="results-section animate-fade-in">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-url">
                <ExternalLink size={16} />
                <span>{url}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Clock size={14} />
                {result.loadTime}ms
              </div>
            </div>

            {/* Score and Meta */}
            <div className="results-grid results-grid-2" style={{ marginBottom: '1.25rem' }}>
              <ScoreGauge score={result.score} />
              <MetaInfoCard data={result.meta} />
            </div>

            {/* Headings and Keywords */}
            <div className="results-grid results-grid-2" style={{ marginBottom: '1.25rem' }}>
              <HeadingsCard headings={result.meta.headings} />
              <KeywordsCard keywords={result.keywords} />
            </div>

            {/* AI Suggestions */}
            <SuggestionsCard suggestions={result.suggestions} />
          </section>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </>
  );
};

export default App;