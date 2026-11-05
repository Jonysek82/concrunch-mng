const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true },
  color: { type: String, default: '#8b5cf6' },
  type: { type: String, enum: ['event','performer','merchant','general'], default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
