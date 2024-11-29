export interface RSSFeed {
  url: string;
  name: string;
  category: string;
}

export interface RSSItem {
  title: string;
  description: string;
  content?: string;
  link: string;
  pubDate: string;
}

export interface RSSChannel {
  item: RSSItem | RSSItem[];
}

export interface RSSResponse {
  rss: {
    channel: RSSChannel;
  };
}