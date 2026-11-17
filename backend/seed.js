require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./services/identity-service/src/models/User');

const identityUri = process.env.IDENTITY_MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_identity';
const festivalUri = process.env.FESTIVAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_festival';

const ensureUser = async (username, password, role) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate(
    { username },
    { username, passwordHash, role, active: true },
    { upsert: true, new: true }
  );
};

const seed = async () => {
  await mongoose.connect(identityUri);
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_this_password';
  const organizerUsername = process.env.SEED_ORGANIZER_USERNAME || 'organizer';
  const organizerPassword = process.env.SEED_ORGANIZER_PASSWORD || 'change_this_password';
  const adminUser = await ensureUser(adminUsername, adminPassword, 'admin');
  const organizerUser = await ensureUser(organizerUsername, organizerPassword, 'organizer');
  await mongoose.disconnect();

  await mongoose.connect(festivalUri);
  const { seedFestival } = require('./services/festival-service/seed');
  await seedFestival({ adminUserId: adminUser._id, organizerUserId: organizerUser._id });
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
