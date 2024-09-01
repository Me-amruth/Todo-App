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

router.get('/', async (req, res) => {
  let id = req.query.id;

  if (!db) {
    return res.status(500).send("Database connection not established");
  }

  try {
    const collection = db.collection('tasks'); // Replace with your collection name
    let data;

    if (id) {
      // Check if the ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
      }
      const objectId = new ObjectId(id);
      data = await collection.findOne({ _id: objectId });
    } else {
      data = await collection.find({}).toArray();
    }

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send("No data found");
    }
    
  } catch (error) {
    console.error('Error retrieving data from MongoDB:', error);
    res.status(500).send("Error retrieving data");
  }
});

module.exports = router;
