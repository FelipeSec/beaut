require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiService = require('./services/aiService');
const scrapingService = require('./services/scrapingService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/recommendations', async (req, res) => {
  try {
    const { preferences } = req.body;
    const recommendations = await aiService.getRecommendations(preferences);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

app.get('/api/prices/:productName', async (req, res) => {
  try {
    const prices = await scrapingService.getPrices(req.params.productName);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape prices" });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});