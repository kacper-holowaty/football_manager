const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const SECRET_KEY = process.env.SECRET_KEY || 'my_secret_key';

userRoutes.route("/login").post(async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = dbo.getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.userId }, SECRET_KEY, { expiresIn: '1h' });
          
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({
      success: false,
      message: "Error while logging in. Please try again later.",
    });
  }
});  

userRoutes.route("/register").post(async (req, res) => {
  saltRounds = 10;
  const { id, firstName, lastName, email, password } = req.body;

  try {
    const db = dbo.getDb();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = {
      userId: id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const result = await db.collection("users").insertOne(newUser);
    
    if (!result.acknowledged) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while registering the user.",
      });
    }

    const token = jwt.sign({ id: newUser.userId }, SECRET_KEY, { expiresIn: '1h' });
  
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
  
    res.json({ message: 'User registered and logged in successfully.' });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error while registering. Please try again later." 
    });
  }
});

userRoutes.route("/user/:id").get(async (req, res) => {
  try {
    const db = dbo.getDb();
    const userId = req.params.id;

    const user = await db.collection("users").findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching user. Please try again later.",
    });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  });
};

userRoutes.route('/is-authenticated').get(authenticateToken, (req, res) => {
  if (!req.user) {
    return res.json({ isAuthenticated: false, userId: '' });
  }
  res.json({ isAuthenticated: true, userId: req.user.id });
});
  
userRoutes.route('/logout').post((req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully.' });
});

module.exports = userRoutes;
