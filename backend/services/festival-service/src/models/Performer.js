const mongoose = require('mongoose');
const { Schema } = mongoose;

const performerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  bio: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  tagIds: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Performer', performerSchema);
