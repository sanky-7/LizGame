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

app.post('/api/scores', async (req, res) => {
    const { name, score } = req.body;
    if (!name || !score) return res.status(400).json({ error: 'Invalid data' });

    const newScore = new Score({ name, score });
    await newScore.save();
    res.json({ message: 'Score saved successfully' });
});

// Handle all other routes and serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});