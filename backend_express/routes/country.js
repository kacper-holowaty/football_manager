const express = require("express");
const countryRoutes = express.Router();

const countries = require('../data/countries.json');

countryRoutes.get('/countries', (req, res) => {
  try {
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

countryRoutes.get('/countries/:country', (req, res) => {
  try {
    const countryName = req.params.country;
    const country = countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());

    if (country) {
        res.json({ code: country.code });
    } else {
        res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

countryRoutes.post('/countries/codes', (req, res) => {
  try {
    const { countries: countryNames } = req.body;

    if (!countryNames || !Array.isArray(countryNames)) {
        return res.status(400).json({ error: 'Invalid request format. Provide an array of country names.' });
    }

    const result = countryNames.map(countryName => {
        const country = countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
        return country ? { country: countryName, code: country.code } : { country: countryName, code: 'unknown' };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = countryRoutes;