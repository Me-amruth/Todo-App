const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { MONGODB_URL } = require('../config');

const client = new MongoClient(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

// Connect to MongoDB once
client.connect()
  .then(() => {
    db = client.db('todo'); // Replace with your database name
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

router.use(cors());

router.post('/', async (req, res) => {
  if (!db) {
    return res.status(500).send("Database connection not established");
  }

  try {
    const collection = db.collection('tasks'); // Replace with your collection name
    await collection.insertOne(req.body);
    res.redirect('/');
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    res.status(500).send("Error inserting data");
  }
});

module.exports = router;
