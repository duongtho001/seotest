export const API_URL = 'http://localhost:3001/analyze';

export const TITLE_OPTIMAL_MIN = 50;
export const TITLE_OPTIMAL_MAX = 60;
export const DESC_OPTIMAL_MIN = 150;
export const DESC_OPTIMAL_MAX = 160;

// For demo purposes if backend is not running
export const DEMO_DATA = {
  url: "https://example.com",
  meta: {
    title: "Example Domain",
    description: "This is a demo description to show how the UI looks when the backend is not connected. It simulates a reasonable length meta description for SEO purposes.",
    headings: {
      h1: ["Example Domain"],
      h2: ["More Information", "About Us"],
      h3: ["Services", "Contact"],
      h4: [],
      h5: [],
      h6: []
    }
  },
  density: {
    single: [
      { phrase: "domain", count: 12, density: 4.5 },
      { phrase: "example", count: 10, density: 3.8 },
      { phrase: "web", count: 8, density: 3.0 }
    ],
    twoWord: [
      { phrase: "example domain", count: 8, density: 3.0 },
      { phrase: "more info", count: 5, density: 1.9 }
    ],
    threeWord: [
      { phrase: "this domain is", count: 3, density: 1.1 }
    ]
  },
  loadTime: 125,
  timestamp: new Date().toISOString()
};