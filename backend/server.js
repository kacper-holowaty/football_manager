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


let players = [];

app.get("/api/players", (req, res) => {
  res.json(players);
});

app.post("/api/players", (req, res) => {
  const player = req.body;
  if (player) {
    players.push(player);
    res.status(201).json(player);
  } else {
    res.status(400).json({ message: "Invalid player data" });
  }
});

app.get("/api/players/:id", (req, res) => {
    const playerId = req.params.id;
    const player = players.find(p => p.id === playerId);
  
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: "Player not found" });
    }
});
  
app.put("/api/players/:id", (req, res) => {
    const playerId = req.params.id;
    const updatedPlayer = req.body;
  
    let playerIndex = players.findIndex(p => p.id === playerId);
  
    if (playerIndex !== -1) {
      players[playerIndex] = { ...players[playerIndex], ...updatedPlayer };
      res.json(players[playerIndex]);
    } else {
      res.status(404).json({ message: "Player not found" });
    }
});
  
app.delete("/api/players/:id", (req, res) => {
    const playerId = req.params.id;
    const playerIndex = players.findIndex(p => p.id === playerId);
  
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Player not found" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});