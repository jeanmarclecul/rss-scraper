import axios from "axios";
import * as cheerio from "cheerio";
import { NewsSource, Article } from "../models/types";
import { getHtml } from "../utils";

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

const getImageSrc = ($element: any) => {
  // 1. Check if $element exists and is a jQuery object (or has a similar find method)
  if (!$element || typeof $element.find !== "function") {
    return ""; // Or handle the error appropriately
  }

  // 2. Find the image element *within* the provided element.  This is crucial!
  const $img = $element.find("img");

  // 3. Check if an image element was actually found
  if ($img.length === 0) {
    return "";
  }

  // 4. Iterate through the attributes of the *image* element
  for (const attr of imgAttributes) {
    const src = $img.attr(attr);
    if (src) {
      return src;
    }
  }

  // 5.  If no image attributes are found, check background styles (important!)
  const bgStyle = $element.css("background-image");
  if (bgStyle && bgStyle !== "none") {
    // Extract URL from background-image style
    const urlMatch = bgStyle.match(/url\(['"]?([^'")]*)['"]?\)/); //Regex for url extraction
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
  }

  console.log($element);

  return "";
};

export async function scrapeNews(source: NewsSource): Promise<Article[]> {
  try {
    const response = await axios.get(source.url);
    const $ = cheerio.load(response.data);
    const articles: Article[] = [];

    $(source.selectors.article).each((_, element) => {
      const $element = $(element);
      const title = $element.find(source.selectors.title).text().trim();
      const summary = $element.find(source.selectors.summary).text().trim();

      const imageUrl = getImageSrc($element) || "";
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
