const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require('path');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const SECRET_KEY = 'my_secret_key';

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

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


// ---------------------------------------------------------------------------------------------------------------------


// oczywiście tutaj będzie baza stworzona

const users = [{ id: '8336ee9b-f866-4cd5-8863-6924f474e523', firstName: 'John', lastName: 'Doe', email: 'test@test.pl', password: 'password' }];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  
  // Send token in HTTP-only cookie
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'strict',
  });

  res.json({ message: 'Logged in successfully' });
});

app.post('/register', (req, res) => {
  const { id, firstName, lastName, email, password } = req.body;

  // Sprawdź, czy użytkownik już istnieje
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Tworzenie nowego użytkownika
  const newUser = {
    id,
    firstName,
    lastName,
    email,
    password, // W realnej aplikacji hasło powinno być hashowane np. bcrypt
  };
  users.push(newUser);

  // Generowanie tokenu JWT
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

  // Wysyłanie tokenu w ciasteczku HTTP-only
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: false, // Ustaw na true w produkcji
    sameSite: 'strict',
  });

  res.json({ message: 'User registered and logged in successfully' });
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

// Logout route
app.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});


// ---------------------------------------------------------------------------------------------------------------------------


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
