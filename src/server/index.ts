import express from "express";
import { newsSources } from "../data/scrapConfig";
import { scrapeNews } from "../scraper/scraper";
import { generateRssFeed } from "../rss/rss";
import { NewsSource } from "../models/types";

const app = express();
const port = 3000;

app.get("/rss/custom", async (req, res) => {
  const { name, url, article, title, summary, image, img } = req.query;

  // Ensure all required parameters are strings
  if (
    typeof name !== "string" ||
    typeof url !== "string" ||
    typeof article !== "string" ||
    typeof title !== "string" ||
    typeof summary !== "string" ||
    typeof image !== "string"
  ) {
    return res
      .status(400)
      .send(
        "Invalid query parameters. All parameters must be strings. Example: /rss/custom?name=x&url=y&article=z&title=t&summary=s&image=i"
      );
  }

  // Construction dynamique de la config avec des types garantis
  const source: NewsSource = {
    name,
    url,
    img: typeof img === "string" ? img : "", // Provide a default empty string if img is not a string
    selectors: {
      article,
      title,
      summary,
      image,
    },
  };

  try {
    const articles = await scrapeNews(source);
    console.log("Scraped articles:", articles);
    const rssFeed = generateRssFeed(name, source.img, articles);

    res.header("Content-Type", "application/xml");
    res.send(rssFeed);
  } catch (error) {
    console.error(`Error generating custom RSS:`, error);
    res.status(500).send("Error generating custom RSS feed");
  }
});

app.get("/rss/youtube/:channelName", async (req, res) => {
  const channelName = req.params.channelName;
  const source: NewsSource = {
    name: channelName,
    url: `https://www.youtube.com/@${channelName}/videos`,
    img: "https://www.youtube.com/s/desktop/d743f78b/img/favicon_96x96.png", // Generic YouTube icon
    selectors: {
      article: "",
      title: "",
      summary: "",
      image: "",
    },
  };

  try {
    console.log(source);
    const articles = await scrapeNews(source);
    const rssFeed = generateRssFeed(source.name, source.img, articles);

    res.header("Content-Type", "application/xml");
    res.send(rssFeed);
  } catch (error) {
    console.error(`Error generating YouTube RSS for ${channelName}:`, error);
    res.status(500).send("Error generating YouTube RSS feed");
  }
});

app.get("/rss/:source", async (req, res) => {
  const sourceName = req.params.source;
  const source = newsSources.find((s) => s.name === sourceName);

  if (sourceName == "list") {
    let output = "";
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    newsSources.forEach((source) => {
      const url = `${baseUrl}/rss/${source.name}`;
      output += `<br><a href="${url}">${url}</a>`;
    });
    res.send(output);
    console.log(baseUrl);
    return true;
  }

  if (!source) {
    return res.status(404).send("Source not found");
  }

  try {
    const articles = await scrapeNews(source);
    const rssFeed = generateRssFeed(sourceName, source.img, articles);

    res.header("Content-Type", "application/xml");
    res.send(rssFeed);
  } catch (error) {
    console.error(`Error generating RSS for ${sourceName}:`, error);
    res.status(500).send("Error generating RSS feed");
  }
});

app.get("/", async (req, res) => {
  let output = "";
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  newsSources.forEach((source) => {
    const url = `${baseUrl}/rss/${source.name}`;
    output += `<br><a href="${url}">${url}</a>`;
  });
  res.send(output);

  return true;
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Available RSS feeds:");
  newsSources.forEach((source) => {
    console.log(`- http://localhost:${port}/rss/${source.name}`);
  });
  console.log(`- http://localhost:${port}/rss/youtube/<channelName>`);
  console.log(
    `- http://localhost:${port}/rsscustom?name=x&url=y&article=z&title=t&summary=s&image=i`
  );
});
