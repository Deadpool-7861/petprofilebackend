const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  date: { type: Date, required: true },
  vaccine: { type: String, required: true },
  notes: String,
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);
