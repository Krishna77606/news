import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { AIResponse } from '../types';
import { askQuestion } from '../services/aiService';

interface QuestionBoxProps {
  articleId: string;
  articleContent: string;
}

export default function QuestionBox({ articleId, articleContent }: QuestionBoxProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AIResponse>({
    answer: '',
    loading: false,
    error: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || response.loading) return;

    setResponse({ ...response, loading: true, error: null });

    try {
      const answer = await askQuestion(articleContent, question);
      setResponse({
        answer,
        loading: false,
        error: null
      });
      setQuestion('');
    } catch (error) {
      setResponse({
        ...response,
        loading: false,
        error: 'Failed to get an answer. Please try again.'
      });
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this article..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={response.loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {response.loading && (
        <div className="text-center text-gray-600">
          Thinking...
        </div>
      )}

      {response.error && (
        <div className="text-red-600 mt-2">
          {response.error}
        </div>
      )}

      {response.answer && !response.loading && (
        <div className="prose mt-4">
          <h4 className="text-lg font-semibold mb-2">Answer:</h4>
          <p className="text-gray-700">{response.answer}</p>
        </div>
      )}
    </div>
  );
}