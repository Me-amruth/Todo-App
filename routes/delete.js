const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { MONGODB_URL } = require('../config');

const client = new MongoClient(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

// Connect to MongoDB once and set the database reference
client.connect()
  .then(() => {
    db = client.db('todo'); // Replace with your database name
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

router.use(cors());

router.delete('/', async (req, res) => {
  let id = req.query.id;

  if (!db) {
    return res.status(500).send("Database connection not established");
  }

  try {
    const collection = db.collection('tasks'); // Replace with your collection name

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      res.status(200).send("Successfully deleted");
    } else {
      res.status(404).send("No data found with the provided ID");
    }

  } catch (error) {
    console.error('Error deleting data from MongoDB:', error);
    res.status(500).send("Error deleting data");
  }
});

module.exports = router;
