const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const countries = require('./data/countries.json');

app.get('/api/countries', (req, res) => {
    res.json(countries);
  });

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
  