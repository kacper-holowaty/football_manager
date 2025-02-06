const express = require("express");
const clubRoutes = express.Router();
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

clubRoutes.route("/clubs").post(upload.single("badge"), async (req, res) => {

  const {
    clubId,
    name,
    ownerId,
    foundedYear,
    stadiumName,
    stadiumCapacity,
    address,
    achievements,
  } = req.body;
  
  try {
    const db = await dbo.getDb();

    const clubCount = await db.collection("clubs").countDocuments({ ownerId });
    if (clubCount >= 4) {
      return res.status(400).json({
        success: false,
        message: "Owner already has 4 clubs, cannot add more.",
      });
    }

    const existingClub = await db.collection("clubs").findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });

    if (existingClub) {
      return res.status(409).json({ success: false, message: "Club with this name already exists." });
    }

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    let imageId = null;

    if (req.file) {
      const uploadStream = bucket.openUploadStream(`${Date.now()}-${req.file.originalname}`, {
        contentType: req.file.mimetype,
      });
      uploadStream.end(req.file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", (file) => {
          imageId = file._id;
          resolve();
        });
        uploadStream.on("error", (err) => reject(err));
      });
    }

    const newClub = {
      clubId,
      name,
      ownerId,
      foundedYear: parseInt(foundedYear),
      stadiumName,
      stadiumCapacity: parseInt(stadiumCapacity),
      address: address,
      achievements: achievements || [],
      badge: imageId,
    };

    const result = await db.collection("clubs").insertOne(newClub);
    res.status(201).json({ success: true, message: "Club added successfully.", id: result.insertedId });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Club with this ID already exists." });
    }
    console.error("Error while adding club:", error);
    res.status(500).json({ success: false, message: "Error while adding the club." });
  }
});

clubRoutes.route("/clubs/:id").get(async (req, res) => {
  const { id } = req.params;

  try {
    const db = await dbo.getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const club = await db.collection("clubs").findOne({ clubId: id }, { projection: { _id: 0 }});

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found." });
    }

    if (club.badge) {
      const files = await bucket.find({ _id: new ObjectId(club.badge) }).toArray();

      if (files.length > 0) {
        const fileStream = bucket.openDownloadStream(files[0]._id);
        const chunks = [];

        fileStream.on("data", (chunk) => chunks.push(chunk));
        fileStream.on("end", () => {
          const fileBuffer = Buffer.concat(chunks);
          const fileBase64 = fileBuffer.toString("base64");

          club.badge = `data:${files[0].contentType};base64,${fileBase64}`;
          res.status(200).json(club);
        });

        fileStream.on("error", (error) => {
          console.error("Error reading file from GridFS:", error);
          res.status(500).json({ success: false, message: "Error retrieving badge image." });
        });
      } else {
        res.status(404).json({ success: false, message: "Badge file not found." });
      }
    } else {
      res.status(200).json(club);
    }
  } catch (error) {
    console.error("Error while retrieving club:", error);
    res.status(500).json({ success: false, message: "Error while retrieving the club." });
  }
});

clubRoutes.route("/clubs/:id").put(upload.single("badge"), async (req, res) => {
  const { id } = req.params;
  const {
    name,
    ownerId,
    foundedYear,
    stadiumName,
    stadiumCapacity,
    address,
    achievements,
  } = req.body;

  try {
    const db = await dbo.getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const existingClub = await db.collection("clubs").findOne({ clubId: id });

    if (!existingClub) {
      return res.status(404).json({ success: false, message: "Club not found." });
    }

    const clubWithSameName = await db.collection("clubs").findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });
    if (clubWithSameName && clubWithSameName.clubId !== id) {
      return res.status(409).json({ success: false, message: "Club with this name already exists." });
    }

    const updateData = {
      name,
      ownerId,
      foundedYear: parseInt(foundedYear),
      stadiumName,
      stadiumCapacity: parseInt(stadiumCapacity),
      address: address,
      achievements: achievements || [],
    };

    if (req.file) {
      if (existingClub.badge) {
        try {
          await bucket.delete(new ObjectId(existingClub.badge));
        } catch (error) {
          console.error(`Error deleting old badge for club ${id}:`, error);
        }
      }

      const uploadStream = bucket.openUploadStream(`${Date.now()}-${req.file.originalname}`, {
        contentType: req.file.mimetype,
      });
      uploadStream.end(req.file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", (file) => {
          updateData.badge = file._id;
          resolve();
        });
        uploadStream.on("error", (err) => reject(err));
      });
    }

    const result = await db.collection("clubs").updateOne({ clubId: id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Club not found." });
    }

    res.status(200).json({ success: true, message: "Club updated successfully." });
  } catch (error) {
    console.error("Error while updating club:", error);
    res.status(500).json({ success: false, message: "Error while updating the club." });
  }
});

clubRoutes.route("/clubs").get(async (req, res) => {

  const userId = req.query.ownerId;

  try {
    const db = await dbo.getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    let clubs;

    if (userId) {
      clubs = await db.collection("clubs").find({ ownerId: userId }).toArray();
    } else {
      clubs = await db.collection("clubs").find({}).toArray();
    }

    const clubsWithImages = await Promise.all(
      clubs.map(async (club) => {
        if (club.badge) {
          const files = await bucket.find({ _id: new ObjectId(club.badge) }).toArray();
          if (files.length > 0) {
            const fileStream = bucket.openDownloadStream(files[0]._id);
            const chunks = [];

            await new Promise((resolve, reject) => {
              fileStream.on("data", (chunk) => chunks.push(chunk));
              fileStream.on("end", () => {
                const fileBuffer = Buffer.concat(chunks);
                const fileBase64 = fileBuffer.toString("base64");
                club.badge = `data:${files[0].contentType};base64,${fileBase64}`;
                resolve();
              });
              fileStream.on("error", (error) => reject(error));
            });
          }
        }
        return club;
      })
    );

    res.status(200).json(clubsWithImages);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ success: false, message: "Error fetching clubs." });
  }
});

clubRoutes.route("/clubs/:id").delete(async (req, res) => {
  const { id } = req.params;
  try {
    const db = await dbo.getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const club = await db.collection("clubs").findOne({ clubId: id });

    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found." });
    }

    if (club.badge) {
      await bucket.delete(new ObjectId(club.badge));
    }

    const players = await db.collection("players").find({ clubId: id }).toArray();

    for (const player of players) {
      if (player.photo) {
        try {
          await bucket.delete(new ObjectId(player.photo));
        } catch (error) {
          console.error(`Error deleting photo for player ${player.playerId}:`, error);
        }
      }
    }

    await db.collection("players").deleteMany({ clubId: id });

    const result = await db.collection("clubs").deleteOne({ clubId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Club not found." });
    }

    res.status(200).json({ success: true, message: "Club, its badge, and associated players deleted successfully." });
  } catch (error) {
    console.error("Error while deleting club and players:", error);
    res.status(500).json({ success: false, message: "Error while deleting the club and associated players." });
  }
});

module.exports = clubRoutes;
