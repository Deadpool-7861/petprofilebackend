const mongoose = require('mongoose');

const groomingSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  date: { type: Date, required: true },
  notes: String,
});

module.exports = mongoose.model('Grooming', groomingSchema);
