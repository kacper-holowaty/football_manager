const { MongoClient } = require("mongodb");
const Db = process.env.MONGO_URI;
console.log(Db);
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (db) {
        _db = db.db("fcmanager");
        console.log("Successfully connected to MongoDB.");
      } else {
        console.error("Connection object is undefined!");
      }

      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};
