const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;
const dbo = require("./db/conn");

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require("./routes/club"));
app.use(require("./routes/user"));
app.use(require("./routes/player"));

const countries = require('./data/countries.json');

app.get('/countries', (req, res) => {
    res.json(countries);
});

app.get('/countries/:country', (req, res) => {
  const countryName = req.params.country;
  const country = countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());

  if (country) {
      res.json({ code: country.code });
  } else {
      res.status(404).json({ error: 'Country not found' });
  }
});

app.post('/countries/codes', (req, res) => {
  const { countries: countryNames } = req.body;

  if (!countryNames || !Array.isArray(countryNames)) {
      return res.status(400).json({ error: 'Invalid request format. Provide an array of country names.' });
  }

  const result = countryNames.map(countryName => {
      const country = countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
      return country ? { country: countryName, code: country.code } : { country: countryName, code: 'unknown' };
  });

  res.json(result);
});

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}...`);
});