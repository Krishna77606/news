import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MessageSquare, FileText, Globe } from 'lucide-react';
import { Article, Summary } from '../types';
import QuestionBox from './QuestionBox';
import { summarizeArticle } from '../services/aiService';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const result = await summarizeArticle(article.content);
      setSummary(result);
      setShowSummary(true);
    } catch (error) {
      setError('Failed to generate summary. Please try again.');
      console.error('Error summarizing article:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-gray-500" />
            <span className="text-sm text-gray-500">{article.source}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(article.publishDate, { addSuffix: true })}
            </span>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {article.category}
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-3">{article.title}</h2>
        <p className="text-gray-600 mb-4">{article.description}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ExternalLink size={16} className="mr-1" />
            Read full article
          </a>
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="flex items-center text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={16} className="mr-1" />
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <MessageSquare size={16} className="mr-1" />
            Ask Questions
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {showSummary && summary && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-gray-700 mb-3">{summary.overview}</p>
            <h4 className="font-semibold mb-2">Key Points:</h4>
            <ul className="list-disc list-inside">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </div>
        )}

        {showQuestions && (
          <QuestionBox articleId={article.id} articleContent={article.content} />
        )}
      </div>
    </article>
  );
}