const express = require("express");
const playerRoutes = express.Router();
const multer = require("multer");
const dbo = require("../db/conn");
const { ObjectId, GridFSBucket } = require("mongodb");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    if (["jpeg", "jpg", "png"].includes(ext)) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed."));
  },
});

playerRoutes.route("/players").post(upload.single("photo"), async (req, res) => {
    const {
      playerId,
      name,
      birthDate,
      nationality,
      position,
      shirtNumber,
      contractUntil,
      salary,
      clubId,
      clubOwnerId
    } = req.body;
  
    try {
      if (!playerId || !name || !birthDate || !nationality || !position || !shirtNumber || !contractUntil || !salary || !clubId || !clubOwnerId) {
        return res.status(400).json({ success: false, message: "Invalid player data. All fields are required." });
      }
  
      const db = await dbo.getDb();
      const existingPlayer = await db.collection("players").findOne({ playerId });
      if (existingPlayer) {
        return res.status(409).json({ success: false, message: "Player with this ID already exists." });
      }

      const clubPlayerCount = await db.collection("players").countDocuments({ clubId });
      if (clubPlayerCount >= 30) {
        return res.status(400).json({ success: false, message: "Club already has 30 players. Cannot add more." });
      }

      const existingShirtNumber = await db.collection("players").findOne({ clubId, shirtNumber: parseInt(shirtNumber) });
      if (existingShirtNumber) {
        return res.status(400).json({ success: false, message: `Shirt number ${shirtNumber} is already taken.` });
      }
  
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });
  
      let photoId = null;
  
      if (req.file) {
        const uploadStream = bucket.openUploadStream(`${Date.now()}-${req.file.originalname}`, {
          contentType: req.file.mimetype,
        });
        uploadStream.end(req.file.buffer);
  
        await new Promise((resolve, reject) => {
          uploadStream.on("finish", (file) => {
            photoId = file._id;
            resolve();
          });
          uploadStream.on("error", (err) => reject(err));
        });
      }
  
      const newPlayer = {
        playerId,
        photo: photoId,
        name,
        birthDate: new Date(birthDate),
        nationality,
        position,
        shirtNumber: parseInt(shirtNumber),
        contractUntil: new Date(contractUntil),
        salary: parseFloat(salary),
        clubId,
        clubOwnerId
      };
  
      const result = await db.collection("players").insertOne(newPlayer);
  
      res.status(201).json({ success: true, message: "Player added successfully.", playerId: result.insertedId });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "Player with this ID already exists." });
      }
      console.error("Error while adding player:", error);
      res.status(500).json({ success: false, message: "Error while adding the player." });
    }
  });

  playerRoutes.route("/players/:playerId").get(async (req, res) => {
    const { playerId } = req.params;
  
    try {
      const db = await dbo.getDb();
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });
  
      const player = await db.collection("players").findOne({ playerId }, { projection: { _id: 0 } });
  
      if (!player) {
        return res.status(404).json({ success: false, message: "Player not found." });
      }
  
      if (player.photo) {
        const files = await bucket.find({ _id: new ObjectId(player.photo) }).toArray();
  
        if (files.length > 0) {
          const fileStream = bucket.openDownloadStream(files[0]._id);
          const chunks = [];
  
          fileStream.on("data", (chunk) => chunks.push(chunk));
          fileStream.on("end", () => {
            const fileBuffer = Buffer.concat(chunks);
            const fileBase64 = fileBuffer.toString("base64");
  
            player.photo = `data:${files[0].contentType};base64,${fileBase64}`;
            res.status(200).json(player);
          });
  
          fileStream.on("error", (error) => {
            console.error("Error reading file from GridFS:", error);
            res.status(500).json({ success: false, message: "Error retrieving player photo." });
          });
        } else {
          res.status(404).json({ success: false, message: "Photo file not found." });
        }
      } else {
        res.status(200).json(player);
      }
    } catch (error) {
      console.error("Error while retrieving player:", error);
      res.status(500).json({ success: false, message: "Error while retrieving the player." });
    }
  });

  playerRoutes.route("/players/:playerId").put(upload.single("photo"), async (req, res) => {
    const { playerId } = req.params;
    const {
      name,
      birthDate,
      nationality,
      position,
      shirtNumber,
      contractUntil,
      salary,
      clubId,
      clubOwnerId
    } = req.body;
  
    try {
      const db = await dbo.getDb();
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });

      const existingPlayer = await db.collection("players").findOne({ playerId });

      if (!existingPlayer) {
        return res.status(404).json({ success: false, message: "Player not found." });
      }

      if (shirtNumber && existingPlayer.shirtNumber !== parseInt(shirtNumber)) {
        const existingShirtNumber = await db.collection("players").findOne({ clubId, shirtNumber: parseInt(shirtNumber) });
        if (existingShirtNumber) {
          return res.status(400).json({ success: false, message: `Shirt number ${shirtNumber} is already taken.` });
        }
      }

      const updateData = {
        name,
        birthDate: new Date(birthDate),
        nationality,
        position,
        shirtNumber: parseInt(shirtNumber),
        contractUntil: new Date(contractUntil),
        salary: parseFloat(salary),
        clubId,
        clubOwnerId
      };

      if (req.file) {
        if (existingPlayer.photo) {
          try {
            await bucket.delete(new ObjectId(existingPlayer.photo));
          } catch (error) {
            console.error(`Error deleting old photo for player ${playerId}:`, error);
          }
        }

        const uploadStream = bucket.openUploadStream(`${Date.now()}-${req.file.originalname}`, {
          contentType: req.file.mimetype,
        });
        uploadStream.end(req.file.buffer);

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", (file) => {
            updateData.photo = file._id;
            resolve();
          });
          uploadStream.on("error", (err) => reject(err));
        });
      }

      const result = await db.collection("players").updateOne({ playerId }, { $set: updateData });

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: "Player not found." });
      }

      res.status(200).json({ success: true, message: "Player updated successfully." });
    } catch (error) {
      console.error("Error while updating player:", error);
      res.status(500).json({ success: false, message: "Error while updating the player." });
    }
  });

  playerRoutes.route("/players/:playerId").delete(async (req, res) => {
    const { playerId } = req.params;
  
    try {
      const db = await dbo.getDb();
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });
  
      const player = await db.collection("players").findOne({ playerId });
  
      if (!player) {
        return res.status(404).json({ success: false, message: "Player not found." });
      }
  
      if (player.photo) {
        await bucket.delete(new ObjectId(player.photo));
      }
  
      const result = await db.collection("players").deleteOne({ playerId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Player not found." });
      }
  
      res.status(200).json({ success: true, message: "Player and its photo deleted successfully." });
    } catch (error) {
      console.error("Error while deleting player:", error);
      res.status(500).json({ success: false, message: "Error while deleting the player." });
    }
  });

  playerRoutes.route("/players/club/:clubId").get(async (req, res) => {
    const { clubId } = req.params;
  
    try {
      const db = await dbo.getDb();
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });
  
      const players = await db.collection("players").find({ clubId }).toArray();
  
      const playersWithPhotos = await Promise.all(
        players.map(async (player) => {
          if (player.photo) {
            try {
              const files = await bucket
                .find({ _id: new ObjectId(player.photo) })
                .toArray();
  
              if (files.length > 0) {
                player.photo = await new Promise((resolve, reject) => {
                  const fileStream = bucket.openDownloadStream(files[0]._id);
                  const chunks = [];
  
                  fileStream.on("data", (chunk) => chunks.push(chunk));
  
                  fileStream.on("end", () => {
                    const fileBuffer = Buffer.concat(chunks);
                    const fileBase64 = fileBuffer.toString("base64");
                    resolve(`data:${files[0].contentType};base64,${fileBase64}`);
                  });
  
                  fileStream.on("error", (error) => {
                    console.error("Error reading file from GridFS:", error);
                    reject(error);
                  });
                });
              }
            } catch (error) {
              console.error("Error retrieving player photo:", error);
            }
          }
          return player;
        })
      );
  
      res.status(200).json(playersWithPhotos);
    } catch (error) {
      console.error("Error while retrieving players:", error);
      res.status(500).json({ success: false, message: "Error while retrieving players." });
    }
  });

  module.exports = playerRoutes;