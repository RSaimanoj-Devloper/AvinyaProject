const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// A simple welcome message for the root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Avinya Web Scraper API!');
});

// The main scraping endpoint
app.get('/scrape', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const { data } = await axios.get(url, {
            headers: {
                // Using a common user-agent to mimic a browser
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        // Scrape the product title
        const title = $('#productTitle').text().trim();

        // Scrape the main product image
        const image = $('#landingImage').attr('src');

        // Scrape product dimensions (this can be tricky and varies greatly)
        let dimensions = 'Not found';
        $('#detailBullets_feature_div .a-list-item').each((i, el) => {
            const featureText = $(el).text();
            if (featureText.includes('Product Dimensions')) {
                dimensions = featureText.replace('Product Dimensions', '').trim();
            }
        });

        if (dimensions === 'Not found') {
            $('#productDetails_detailBullets_sections1 tr').each((i, el) => {
                if ($(el).find('th').text().trim() === 'Product Dimensions') {
                    dimensions = $(el).find('td').text().trim();
                }
            });
        }

        res.json({
            title,
            image,
            dimensions
        });

    } catch (error) {
        console.error('Scraping failed:', error);
        res.status(500).json({ error: 'Failed to scrape the product page. The site structure may have changed or the URL is incorrect.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
