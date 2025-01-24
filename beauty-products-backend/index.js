const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Example route to scrape prices
app.get("/scrape-prices", async (req, res) => {
  const { productName } = req.query;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    // URL of a website to scrape (example: Amazon, eBay, etc.)
    const searchUrl = `https://www.example.com/search?q=${encodeURIComponent(productName)}`;

    // Fetch the HTML from the site
    const { data: html } = await axios.get(searchUrl);

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract product prices (this logic will depend on the site's structure)
    const prices = [];
    $(".product-item").each((_, element) => {
      const name = $(element).find(".product-name").text().trim();
      const price = $(element).find(".product-price").text().trim();
      const link = $(element).find(".product-link").attr("href");

      if (name && price) {
        prices.push({ name, price, link: `https://www.example.com${link}` });
      }
    });

    res.json({ prices });
  } catch (error) {
    console.error("Error scraping prices:", error);
    res.status(500).json({ error: "Failed to scrape prices" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
