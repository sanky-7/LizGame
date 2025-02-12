const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb+srv://sanketvaibhav10:lWauBd1FMxzFZDMS@cluster0.to3co.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Score Schema
const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
});

const Score = mongoose.model('Score', scoreSchema);

// API Routes
app.get('/api/scores', async (req, res) => {
    const scores = await Score.find().sort({ score: -1 }).limit(5);
    res.json(scores);
});

app.post("/api/scores", async (req, res) => {
    const { name, score } = req.body;
  
    // Fetch current top 5 scores
    const topScores = await Score.find().sort({ score: -1 }).limit(5);
  
    // If less than 5 scores exist, add the new score
    if (topScores.length < 5) {
      const newScore = new Score({ name, score });
      await newScore.save();
      return res.json(newScore);
    }
  
    // Check if the new score qualifies for the top 5
    const lowestScore = topScores[topScores.length - 1];
  
    if (score > lowestScore.score) {
      // Insert the new score
      const newScore = new Score({ name, score });
      await newScore.save();
  
      // Remove the lowest score from the database
      await Score.findByIdAndDelete(lowestScore._id);
  
      return res.json(newScore);
    }
    
    res.json({ message: "Score is not high enough to enter the top 5." });
});

// Handle all other routes and serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});