const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  day: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  performerIds: [{ type: Schema.Types.ObjectId, ref: 'Performer' }],
  tagIds: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  status: { type: String, enum: ['draft','published','cancelled'], default: 'draft' },
  cancellationReason: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
