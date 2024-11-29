import { Summary } from '../types';
import { mockSummarizeArticle, mockAskQuestion } from './mockAiService';
import { aiClient } from './api/client';
import { AIServiceResponse } from './api/types';
import { API_CONFIG } from '../config/api';

export async function summarizeArticle(content: string): Promise<Summary> {
  if (API_CONFIG.IS_DEVELOPMENT) {
    return mockSummarizeArticle(content);
  }

  try {
    const response = await aiClient.post<AIServiceResponse>('', {
      prompt: `Please provide a concise summary of the following article, followed by key points:\n\n${content}`,
      max_tokens: 300,
      temperature: 0.7,
    });

    if (!response.data?.choices?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    const text = response.data.choices[0].text.trim();
    const [overview, keyPointsText] = text.split('Key Points:');
    const keyPoints = keyPointsText
      ?.split('\n')
      .filter(point => point.trim())
      .map(point => point.replace(/^[•-]\s*/, '').trim()) || [];

    return {
      overview: overview.trim(),
      keyPoints,
    };
  } catch (error) {
    console.error('Error summarizing article:', error);
    throw new Error('Failed to generate summary');
  }
}

export async function askQuestion(content: string, question: string): Promise<string> {
  if (API_CONFIG.IS_DEVELOPMENT) {
    return mockAskQuestion(content, question);
  }

  try {
    const response = await aiClient.post<AIServiceResponse>('', {
      prompt: `Based on this article:\n\n${content}\n\nPlease answer this question: ${question}`,
      max_tokens: 300,
      temperature: 0.7,
    });

    if (!response.data?.choices?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error getting answer:', error);
    throw new Error('Failed to get answer');
  }
}