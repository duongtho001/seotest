/* 
  NOTE: This is the server-side code. To run this:
  1. Initialize a node project: `npm init -y`
  2. Install dependencies: `npm install express cors cheerio axios`
  3. Run: `node index.js`
  4. Ensure your frontend calls localhost:3001
*/

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper to remove stop words and count phrases
const getDensity = (text) => {
  const stopWords = new Set([
    "a", "an", "the", "is", "and", "or", "to", "of", "in", "for", "on", "with", "as", "at", "by", "from", "up", "out", "into", "over", "under", "above", "below", "through", "about", "before", "after", "since", "until", "while", "where", "when", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "are", "be", "has", "have", "had", "do", "does", "did", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very"
  ]);

  // Clean text: lowercase, remove special chars, normalize spaces
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ').filter(w => w.length > 1);
  const totalWords = words.length;

  const countPhrases = (n) => {
    const counts = {};
    for (let i = 0; i <= words.length - n; i++) {
      // Check if any word in the phrase is a stop word (optional strictness, usually we just filter single stop words)
      const phraseArr = words.slice(i, i + n);
      const phrase = phraseArr.join(' ');
      
      // Filter logic: For 1-word, exclude stop words. For n-grams, usually kept unless it's purely stopwords
      if (n === 1 && stopWords.has(phrase)) continue;
      
      counts[phrase] = (counts[phrase] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([phrase, count]) => ({
        phrase,
        count,
        density: (count / (totalWords - (n-1))) * 100 // Approximation
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  };

  return {
    single: countPhrases(1),
    twoWord: countPhrases(2),
    threeWord: countPhrases(3)
  };
};

app.post('/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const startTime = Date.now();
    
    // Validate URL format
    new URL(url); 

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'SEO-Auditor-Bot/1.0'
      },
      timeout: 10000
    });
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove scripts, styles, etc for text analysis
    $('script, style, nav, footer, header, noscript, iframe, svg').remove();
    const bodyText = $('body').text();

    const result = {
      url,
      timestamp: new Date().toISOString(),
      loadTime,
      meta: {
        title: $('title').text() || '',
        description: $('meta[name="description"]').attr('content') || '',
        headings: {
          h1: $('h1').map((i, el) => $(el).text().trim()).get(),
          h2: $('h2').map((i, el) => $(el).text().trim()).get(),
          h3: $('h3').map((i, el) => $(el).text().trim()).get(),
          h4: $('h4').map((i, el) => $(el).text().trim()).get(),
          h5: $('h5').map((i, el) => $(el).text().trim()).get(),
          h6: $('h6').map((i, el) => $(el).text().trim()).get(),
        }
      },
      density: getDensity(bodyText)
    };

    res.json(result);

  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to analyze page' });
  }
});

app.listen(PORT, () => {
  console.log(`SEO Server running on port ${PORT}`);
});