import axios from "axios";
import * as cheerio from "cheerio";
import { NewsSource, Article } from "./types";
import { getHtml } from "./utils";

export async function scrapeNews(source: NewsSource): Promise<Article[]> {
  try {
    const response = await axios.get(source.url);
    const $ = cheerio.load(response.data);
    const articles: Article[] = [];

    $(source.selectors.article).each((_, element) => {
      const $element = $(element);
      const title = $element.find(source.selectors.title).text().trim();
      const summary = $element.find(source.selectors.summary).text().trim();
      const imageUrl =
        $element.find(source.selectors.image).find("img").attr("data-src") ||
        "";
      const url = $element.find("a").attr("href") || "";

      if (title && summary) {
        articles.push({
          title,
          summary,
          imageUrl,
          url: url.startsWith("http") ? url : `${source.url}${url}`,
          date: new Date(),
        });
      }

      console.log(articles[articles.length - 1]);
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}
