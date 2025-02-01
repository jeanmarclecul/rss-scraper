import RSS from "rss";
import { Article } from "./types";

export function generateRssFeed(
  sourceName: string,
  articles: Article[]
): string {
  const feed = new RSS({
    title: `${sourceName} News Feed`,
    description: `Latest news from ${sourceName}`,
    feed_url: `http://localhost:3000/rss/${sourceName}`,
    site_url: `http://localhost:3000`,
    language: "fr",
    pubDate: new Date().toUTCString(), // Add publication date
  });

  articles.forEach((article) => {
    feed.item({
      title: article.title,
      description: article.summary,
      url: article.url,
      guid: article.url,
      date: article.date, // Add article date
      enclosure: article.imageUrl
        ? {
            url: article.imageUrl,
            type: "image/jpeg", // Add MIME type
          }
        : undefined,
    });
  });

  return feed.xml({ indent: true }); // Add proper XML formatting
}
