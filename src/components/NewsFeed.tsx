import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw } from 'lucide-react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import { fetchAllFeeds } from '../utils/rssParser';
import { NEWS_FEEDS } from '../config/newsFeeds';

const CATEGORIES = ['All', ...Array.from(new Set(NEWS_FEEDS.map(feed => feed.category)))];

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await fetchAllFeeds();
      setArticles(fetchedArticles);
    } catch (error) {
      setError('Failed to fetch news articles. Please try again later.');
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // Refresh articles every 5 minutes
    const interval = setInterval(fetchArticles, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Newspaper className="text-blue-600" />
          News Feed
        </h1>
        
        <div className="flex items-center gap-4">
          <button
            onClick={fetchArticles}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Refresh articles"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="flex gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-600">
              No articles found for this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}