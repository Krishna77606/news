import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { Article } from '../types';
import { NEWS_FEEDS } from '../config/newsFeeds';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function fetchAllFeeds(): Promise<Article[]> {
  try {
    const feedPromises = NEWS_FEEDS.map(feed => fetchFeed(feed.url, feed.name, feed.category));
    const feedResults = await Promise.allSettled(feedPromises);
    
    return feedResults
      .filter((result): result is PromiseFulfilledResult<Article[]> => result.status === 'fulfilled')
      .flatMap(result => result.value)
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return [];
  }
}

async function fetchFeed(feedUrl: string, sourceName: string, category: string): Promise<Article[]> {
  try {
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`);
    const parsed = parser.parse(response.data);
    const channel = parsed.rss?.channel;
    
    if (!channel?.item) {
      console.error(`No items found in feed: ${feedUrl}`);
      return [];
    }

    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    
    return items.map((item, index) => ({
      id: `${sourceName}-${index}-${Date.now()}`,
      title: item.title || 'Untitled',
      description: item.description || '',
      content: item['content:encoded'] || item.description || '',
      sourceUrl: item.link || '',
      publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      category,
      source: sourceName
    }));
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return [];
  }
}