const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require('path');
const fs = require('fs-extra');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// tworzenie katalogu uploads (zdjęcia wstawiane z frontendu) - opcja tymczasowa
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Katalog "uploads" został utworzony.');
}

app.use('/uploads', express.static(uploadsDir));

const countries = require('./data/countries.json');

app.get('/api/countries', (req, res) => {
    res.json(countries);
});


let players = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: fileFilter
});


app.get("/api/players", (req, res) => {
  res.json(players);
});

app.post("/api/players", upload.single("photo"), (req, res) => {
  const { id, name, birthDate, nationality, position, shirtNumber, contractUntil, salary, clubId } = req.body;

  if (!id || !name || !birthDate || !nationality || !position || !shirtNumber || !contractUntil || !salary || !clubId) {
    return res.status(400).json({ message: "Invalid player data" });
  }

  const player = {
    id,
    photo: req.file ? `/uploads/${req.file.filename}` : null,
    name,
    birthDate: new Date(birthDate),
    nationality,
    position,
    shirtNumber: parseInt(shirtNumber),
    contractUntil: new Date(contractUntil),
    salary: parseFloat(salary),
    clubId
  };

  players.push(player);
  res.status(201).json(player);
});

app.get("/api/players/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    const player = players.find(p => p.id === playerId);
  
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: "Player not found" });
    }
});
  
app.put("/api/players/:playerId", upload.single("photo"), (req, res) => {
  const playerId = req.params.playerId;
  const updatedPlayer = req.body;

  const playerIndex = players.findIndex((p) => p.id === playerId);

  if (playerIndex !== -1) {
    const player = players[playerIndex];

    players[playerIndex] = {
      ...player,
      ...updatedPlayer,
      photo: req.file ? `/uploads/${req.file.filename}` : player.photo,
    };

    res.json(players[playerIndex]);
  } else {
    res.status(404).json({ message: "Player not found" });
  }
});
  
app.delete("/api/players/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    const playerIndex = players.findIndex(p => p.id === playerId);
  
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Player not found" });
    }
});

// usuwanie katalogu uploads (zawiera zdjęcia) - opcja tymczasowa 
process.on('SIGINT', async () => {
  console.log("\nZatrzymywanie serwera...");
  
  try {
    await fs.rm(uploadsDir, { recursive: true, force: true });
    console.log('Katalog "uploads" i jego zawartość zostały usunięte.');
  } catch (err) {
    console.error('Błąd podczas usuwania katalogu uploads:', err);
  }
  
  process.exit();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
