const mongoose = require('mongoose');
const { Schema } = mongoose;

const merchantSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  website: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  tagIds: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Merchant', merchantSchema);
