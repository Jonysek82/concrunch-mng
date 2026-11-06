const mongoose = require('mongoose');

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
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
