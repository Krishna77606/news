import { Summary } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockSummarizeArticle(content: string): Promise<Summary> {
  await delay(1500); // Simulate API call delay
  
  return {
    overview: `This is a mock summary of the article that discusses ${content.slice(0, 100)}...`,
    keyPoints: [
      'First key point from the article',
      'Second important takeaway',
      'Final significant point'
    ]
  };
}

export async function mockAskQuestion(content: string, question: string): Promise<string> {
  await delay(1000); // Simulate API call delay
  
  return `This is a mock answer to your question "${question}" based on the article content.`;
}