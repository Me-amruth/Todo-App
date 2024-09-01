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

router.post('/', async (req, res) => {
 let id = req.query.id;
  if (!db) {
    return res.status(500).send("Database connection not established");
  }

  if (!id) {
    return res.status(400).send("ID and update data are required");
  }

  try {
    const collection = db.collection('tasks'); // Replace with your collection name

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const objectId = new ObjectId(id);
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: req.body }
    );

    if (result.matchedCount === 1) {
      res.redirect('/');
    } else {
      res.status(404).send("No data found with the provided ID");
    }

  } catch (error) {
    console.error('Error updating data in MongoDB:', error);
    res.status(500).send("Error updating data");
  }
});

module.exports = router;
