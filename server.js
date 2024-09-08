const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Profile = require('./models/PetProfile'); // Ensure this is the correct model file
require('dotenv').config();

const app = express();
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Route to create a new profile with an image upload
app.post('/profiles', upload.single('profilePicture'), async (req, res) => {
  try {
    const profile = new Profile({
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      profilePicture: req.file ? req.file.path : null, // Save the path of the uploaded file
    });
    await profile.save();
    res.status(201).send(profile);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Route to get all profiles
app.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.send(profiles);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Route to get a profile by ID
app.get('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).send('Profile not found');
    res.send(profile);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Route to update a profile
app.put('/profiles/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      profilePicture: req.file ? req.file.path : null, // Update the profile picture if a new one is uploaded
    };
    const profile = await Profile.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!profile) return res.status(404).send('Profile not found');
    res.send(profile);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Route to delete a profile
app.delete('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).send('Profile not found');
    res.send(profile);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Use PORT environment variable or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
