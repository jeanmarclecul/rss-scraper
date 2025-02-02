import express from "express";
import { newsSources } from "./config";
import { scrapeNews } from "./scraper";
import { generateRssFeed } from "./rss";

const app = express();
const port = 3000;

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
    const rssFeed = generateRssFeed(sourceName, articles);

    res.header("Content-Type", "application/xml");
    res.send(rssFeed);
  } catch (error) {
    console.error(`Error generating RSS for ${sourceName}:`, error);
    res.status(500).send("Error generating RSS feed");
  }
});

// app.get("/rsslist", async (req, res) => {
//   let output = "";
//   newsSources.forEach((source) => {
//     output += "<br>/rss/" + source.name;
//   });
//   res.send(output);
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Available RSS feeds:");
  newsSources.forEach((source) => {
    console.log(`- http://localhost:${port}/rss/${source.name}`);
  });
});
