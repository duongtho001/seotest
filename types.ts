export interface KeywordMetric {
  phrase: string;
  count: number;
  density: number;
}

export interface KeywordDensity {
  single: KeywordMetric[];
  twoWord: KeywordMetric[];
  threeWord: KeywordMetric[];
}

export interface MetaData {
  title: string;
  description: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
}

export interface AnalysisResult {
  url: string;
  meta: MetaData;
  density: KeywordDensity;
  loadTime: number; // in ms
  timestamp: string;
}

export interface ApiError {
  message: string;
}
