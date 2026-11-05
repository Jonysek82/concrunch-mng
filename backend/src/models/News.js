const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft','published'], default: 'draft' },
  publishedAt: { type: Date, default: null },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
