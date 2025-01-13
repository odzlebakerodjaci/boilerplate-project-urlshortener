require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Simulated database for short URLs
const database = {};
let id = 1;

// Function to define routes for short URLs
const defineShortUrlRoute = () => {
  // POST endpoint to create a short URL
  app.post('/api/shorturl', function (req, res) {
    const url = req.body.url;

    // URL validation
    const urlRegex = /^(https?:\/\/)(www\.)?([\w-]+)\.([a-z]{2,})([\w./?=#-]*)?$/;
    if (!url || !urlRegex.test(url)) {
      return res.json({ error: 'invalid url' });
    }

    // Save the URL in the database and generate a short URL
    const shortUrl = id++;
    database[shortUrl] = url;

    res.json({ original_url: url, short_url: shortUrl });
  });

  // GET endpoint to redirect to the original URL
  app.get('/api/shorturl/:shortUrl', function (req, res) {
    const shortUrl = req.params.shortUrl;

    if (!database[shortUrl]) {
      return res.status(404).json({ error: 'No URL found for given short_url' });
    }

    res.redirect(database[shortUrl]);
  });
};

defineShortUrlRoute();

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
