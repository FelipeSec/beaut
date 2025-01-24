const axios = require('axios');
const cheerio = require('cheerio');

class ScrapingService {
  async getPrices(productName) {
    try {
      const retailers = {
        'amazon.com.br': 'https://www.amazon.com.br/s?k=',
        'belezanaweb.com.br': 'https://www.belezanaweb.com.br/busca?q=',
        'sephora.com.br': 'https://www.sephora.com.br/busca?q='
      };

      const results = await Promise.all(
        Object.entries(retailers).map(async ([store, baseUrl]) => {
          try {
            const url = `${baseUrl}${encodeURIComponent(productName)}`;
            const response = await axios.get(url, {
              headers: {
                'User-Agent': process.env.USER_AGENT
              }
            });
            const $ = cheerio.load(response.data);
            
            // Store-specific selectors
            const selectors = {
              'amazon.com.br': {
                price: '.a-price-whole',
                link: '.a-link-normal'
              },
              'belezanaweb.com.br': {
                price: '.price-value',
                link: '.product-item-link'
              },
              'sephora.com.br': {
                price: '.price',
                link: '.product-link'
              }
            };

            const priceElement = $(selectors[store].price).first();
            const linkElement = $(selectors[store].link).first();

            if (priceElement.length && linkElement.length) {
              return {
                store,
                price: priceElement.text().trim(),
                link: linkElement.attr('href')
              };
            }
          } catch (error) {
            console.error(`Error scraping ${store}:`, error);
          }
          return null;
        })
      );

      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    }
  }
}

module.exports = new ScrapingService();