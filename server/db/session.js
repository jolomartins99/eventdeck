var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  kind: String,
  img: String,
  place: String,
  description: String,
  speakers: [{
    id: String, // for main speakers
    name: String, // for other speakers
    position: String // for other speakers
  }],
  companies: [ String ],
  date: { type: Date },
  duration: { type: Date },
  updated: { type: Date },
  tickets: {
    needed: Boolean,
    start: Date,
    end: Date,
    max: Number
  },
});

var Session = module.exports = mongoose.model('Session', schema);
