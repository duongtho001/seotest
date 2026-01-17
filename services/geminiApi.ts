// Gemini API Service for SEO Analysis

// Available Gemini Models (Updated Jan 2025)
export const GEMINI_MODELS = [
    { id: 'gemini-3-pro', name: 'Gemini 3 Pro (Mới nhất)' },
    { id: 'gemini-3-flash', name: 'Gemini 3 Flash' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

const DEFAULT_MODEL = 'gemini-2.5-flash';

const getApiUrl = (model: string) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export interface SEOAnalysisResult {
    score: number;
    meta: {
        title: string;
        titleLength: number;
        description: string;
        descriptionLength: number;
        headings: {
            h1: string[];
            h2: string[];
            h3: string[];
        };
    };
    keywords: {
        phrase: string;
        count: number;
        density: number;
    }[];
    suggestions: {
        type: 'good' | 'warning' | 'bad';
        message: string;
    }[];
    loadTime: number;
    timestamp: string;
}

// API Key Management
export const getApiKey = (): string | null => {
    return localStorage.getItem('gemini_api_key');
};

export const setApiKey = (key: string): void => {
    localStorage.setItem('gemini_api_key', key);
};

export const removeApiKey = (): void => {
    localStorage.removeItem('gemini_api_key');
};

// Model Management
export const getSelectedModel = (): string => {
    return localStorage.getItem('gemini_model') || DEFAULT_MODEL;
};

export const setSelectedModel = (model: string): void => {
    localStorage.setItem('gemini_model', model);
};

// Main Analysis Function
export const analyzeWithGemini = async (url: string): Promise<SEOAnalysisResult> => {
    const apiKey = getApiKey();
    const model = getSelectedModel();

    if (!apiKey) {
        throw new Error('API_KEY_REQUIRED');
    }

    const startTime = Date.now();

    const prompt = `Analyze the SEO of this webpage URL: ${url}

Please provide a comprehensive SEO analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "score": <number 0-100 representing overall SEO score>,
  "meta": {
    "title": "<page title>",
    "titleLength": <number>,
    "description": "<meta description>",
    "descriptionLength": <number>,
    "headings": {
      "h1": ["<h1 texts>"],
      "h2": ["<h2 texts>"],
      "h3": ["<h3 texts>"]
    }
  },
  "keywords": [
    {"phrase": "<keyword>", "count": <number>, "density": <percentage>}
  ],
  "suggestions": [
    {"type": "good|warning|bad", "message": "<suggestion text>"}
  ]
}

Important guidelines:
1. Score should reflect real SEO quality (title length, meta description, heading structure, keyword usage)
2. Title optimal length: 50-60 characters
3. Description optimal length: 150-160 characters
4. Check for H1 tag presence (should have exactly 1)
5. Analyze keyword density (2-3% is optimal)
6. Provide actionable suggestions
7. Keywords array should have top 10 keywords with their count and density percentage

Respond ONLY with the JSON object, no additional text or markdown formatting.`;

    try {
        const response = await fetch(`${getApiUrl(model)}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 4096,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 || response.status === 403) {
                throw new Error('INVALID_API_KEY');
            }
            throw new Error(errorData.error?.message || 'Failed to analyze with Gemini');
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            throw new Error('No response from Gemini');
        }

        // Parse JSON from response (handle potential markdown code blocks)
        let jsonStr = textContent.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const analysisResult = JSON.parse(jsonStr);
        const endTime = Date.now();

        return {
            ...analysisResult,
            loadTime: endTime - startTime,
            timestamp: new Date().toISOString()
        };

    } catch (error: any) {
        if (error.message === 'API_KEY_REQUIRED' || error.message === 'INVALID_API_KEY') {
            throw error;
        }
        console.error('Gemini API Error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
    }
};

// Demo data for testing without API
export const getDemoAnalysis = (): Promise<SEOAnalysisResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                score: 78,
                meta: {
                    title: "Example Domain - Your Gateway to the Web",
                    titleLength: 42,
                    description: "This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.",
                    descriptionLength: 156,
                    headings: {
                        h1: ["Example Domain"],
                        h2: ["About This Domain", "How to Use"],
                        h3: ["Getting Started", "Documentation", "Support"]
                    }
                },
                keywords: [
                    { phrase: "domain", count: 15, density: 4.2 },
                    { phrase: "example", count: 12, density: 3.4 },
                    { phrase: "web", count: 8, density: 2.3 },
                    { phrase: "internet", count: 6, density: 1.7 },
                    { phrase: "website", count: 5, density: 1.4 },
                    { phrase: "documentation", count: 4, density: 1.1 },
                    { phrase: "illustrative", count: 3, density: 0.9 },
                    { phrase: "permission", count: 2, density: 0.6 }
                ],
                suggestions: [
                    { type: "good", message: "Title length is optimal (42 characters)" },
                    { type: "good", message: "Meta description is within recommended length (156 characters)" },
                    { type: "good", message: "Page has exactly one H1 tag" },
                    { type: "warning", message: "Consider adding more internal links to improve navigation" },
                    { type: "warning", message: "Keyword 'domain' density is slightly high (4.2%). Aim for 2-3%" },
                    { type: "bad", message: "No alt text found for images" },
                    { type: "bad", message: "Missing Open Graph meta tags for social sharing" }
                ],
                loadTime: 1250,
                timestamp: new Date().toISOString()
            });
        }, 2000);
    });
};
