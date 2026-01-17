import { AnalysisResult } from '../types';
import { API_URL, DEMO_DATA } from '../constants';

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze URL');
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend connection failed, returning error state.", error);
    throw error;
  }
};

// Helper for users who can't run the backend immediately
export const getDemoData = (): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DEMO_DATA as AnalysisResult);
    }, 1500);
  });
};