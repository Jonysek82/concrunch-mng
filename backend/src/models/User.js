const mongoose = require('mongoose');

// Žádost uživatele o roli organizátora a její vyřízení adminem.
const organizerRequestSchema = new mongoose.Schema({
  status: { type: String, enum: ['none','pending','approved','rejected'], default: 'none' },
  message: { type: String, default: '' },
  requestedAt: { type: Date },
  decidedAt: { type: Date },
  decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String, default: '' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  // Uživatel přihlášený přes Google heslo nemá.
  passwordHash: { type: String },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  name: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local','google'], default: 'local' },
  role: { type: String, enum: ['visitor','organizer','admin'], default: 'visitor' },
  active: { type: Boolean, default: true },
  organizerRequest: { type: organizerRequestSchema, default: () => ({}) }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
