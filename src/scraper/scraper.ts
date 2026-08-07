import axios from "axios";
import * as cheerio from "cheerio";
import { NewsSource, Article } from "../models/types";

interface CheapSharkStore {
  storeID: string;
  storeName: string;
  isActive: number;
  images: {
    banner: string;
    logo: string;
    icon: string;
  };
}

interface CheapSharkDeal {
  title: string;
  storeID: string;
  salePrice: string;
  normalPrice: string;
  dealID: string;
  thumb: string;
}

const imgAttributes = [
  "src",
  "data-src",
  "data-original",
  "data-lazy-src",
  "data-srcset",
  "data-sizes",
  "srcset",
  "data-bg",
  "data-background-image",
  "data-img-src",
  "data-image-src",
  "data-original-src",
  "data-fallback-src",
  "data-src-retina",
  "data-low-res-src",
  "data-high-res-src",
  "data-thumb",
  "data-bg-src",
  "data-lazy-original",
  "data-echo",
  "data-echo-background",
  "data-src-mobile",
  "data-src-tablet",
  "data-src-desktop",
  "data-lazy-loaded",
  "data-was-processed",
  "data-ll-status",
  "loading",
  "data-pin-media",
  "data-large-src",
  "data-medium-src",
  "data-small-src",
  "data-webp-src",
  "data-jp2-src",
  "data-jxr-src",
  "data-lazy",
  "data-lazy-src-set",
  "data-normal",
  "data-retina",
  "data-savepage-src",
  "data-master",
  "data-o-src",
  "data-origin",
  "data-src-full",
  "data-src-thumb",
  "data-smsrc",
  "data-lgsrc",
  "data-defer-src",
  "data-gt-lazy-src",
];

const isYouTubeLink = (url: string): boolean => url.includes("youtube.com");

const getImageSrc = ($element: any) => {
  if (!$element || typeof $element.find !== "function") {
    return "";
  }

  const $img = $element.find("img");
  if ($img.length === 0) return "";

  for (const attr of imgAttributes) {
    const src = $img.attr(attr);
    if (src) return src;
  }

  const bgStyle = $element.css("background-image");
  if (bgStyle && bgStyle !== "none") {
    const urlMatch = /url\(['"]?([^'")]*)['"]?\)/.exec(bgStyle);
    if (urlMatch?.[1]) return urlMatch[1];
  }

  return "";
};

export async function scrapeNews(source: NewsSource): Promise<Article[]> {
  try {
    if (isYouTubeLink(source.url)) {
      return await scrapeYouTubeVideos(source.url);
    } else if (source.url.includes("cheapshark")) {
      return await scrapeCheapSharkDeals();
    } else {
      return await scrapeGenericWebsite(source);
    }
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

// ✅ YouTube Video Scraper
async function scrapeYouTubeVideos(channelUrl: string): Promise<Article[]> {
  try {
    const response = await axios.get(channelUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    const $ = cheerio.load(response.data);
    let videos: Article[] = [];

    const scriptTag = $("script")
      .toArray()
      .map((el) => $(el).html())
      .find((text) => text?.includes("ytInitialData"));

    if (!scriptTag) {
      throw new Error("ytInitialData not found in HTML");
    }

    const jsonMatch = /ytInitialData\s*=\s*(\{[\s\S]*?\});/.exec(scriptTag);

    if (!jsonMatch) {
      throw new Error("Failed to extract ytInitialData JSON");
    }

    const ytData = JSON.parse(jsonMatch[1]);

    const videoItems =
      ytData.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content
        .richGridRenderer.contents;

    videoItems.forEach((item: any) => {
      if (item.richItemRenderer?.content?.videoRenderer) {
        const video = item.richItemRenderer.content.videoRenderer;
        videos.push({
          title: video.title.runs[0].text,
          summary: video.descriptionSnippet?.runs[0]?.text || "No description",
          imageUrl: video.thumbnail.thumbnails.pop().url,
          url: `https://www.youtube.com/watch?v=${video.videoId}`,
          date: new Date(),
        });
      }
    });

    return videos;
  } catch (error) {
    console.error(`Error scraping YouTube:`, error);
    return [];
  }
}

// ✅ Generic Website Scraper
async function scrapeGenericWebsite(source: NewsSource): Promise<Article[]> {
  try {
    const response = await axios.get(source.url);
    const baseUrl = new URL(source.url).origin;
    const $ = cheerio.load(response.data);
    const articles: Article[] = [];

    $(source.selectors.article).each((_, element) => {
      const $element = $(element);
      const title = $element.find(source.selectors.title).text().trim();
      const summary = $element.find(source.selectors.summary).text().trim();
      const imageUrl = getImageSrc($element);
      const url = $element.find("a").attr("href") || "";

      if (title && summary) {
        articles.push({
          title,
          summary,
          imageUrl: imageUrl?.startsWith("http")
            ? imageUrl
            : `${baseUrl}${imageUrl}`,
          url: url.startsWith("http") ? url : `${baseUrl}${url}`,
          date: new Date(),
        });
      }
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

// ✅ CheapShark Free Games Scraper
async function scrapeCheapSharkDeals(): Promise<Article[]> {
  try {
    const dealsResponse = await axios.get("https://www.cheapshark.com/api/1.0/deals", {
      headers: { "User-Agent": "RSS-Scraper/1.0 (contact@example.com)" },
      params: {
        upperPrice: 0,
        pageSize: 20,
      },
    });

    const storesResponse = await axios.get("https://www.cheapshark.com/api/1.0/stores", {
      headers: { "User-Agent": "RSS-Scraper/1.0 (contact@example.com)" },
    });

    const deals: CheapSharkDeal[] = dealsResponse.data;
    const stores: CheapSharkStore[] = storesResponse.data;

    const storesMap = new Map<string, CheapSharkStore>();
    stores.forEach((store) => {
      storesMap.set(store.storeID, store);
    });

    const articles: Article[] = deals.map((deal) => {
      const store = storesMap.get(deal.storeID);
      const storeName = store?.storeName || "Unknown Store";
      const storeIcon = store?.images?.icon ? `https://www.cheapshark.com${store.images.icon}` : "";
      const dealUrl = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;

      const storeIconHtml = storeIcon ? `<img src="${storeIcon}" alt="${storeName}" style="vertical-align: middle; height: 16px;">` : "";
      const summary = `${storeIconHtml} <strong>${storeName}</strong> | Price: ${deal.salePrice}€ (was ${deal.normalPrice}€)`;

      return {
        title: deal.title,
        summary,
        imageUrl: deal.thumb,
        url: dealUrl,
        date: new Date(),
      };
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping CheapShark:`, error);
    return [];
  }
}
