const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const ROLES = ['visitor', 'organizer', 'admin'];

const googleClient = new OAuth2Client();

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const getDefaultRole = () => {
  const role = (process.env.GOOGLE_DEFAULT_ROLE || 'visitor').trim();
  return ROLES.includes(role) ? role : 'visitor';
};

const isAdminEmail = (email) => getAdminEmails().includes((email || '').toLowerCase());

const toPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatarUrl,
  role: user.role,
  authProvider: user.authProvider
});

const issueToken = (user) => {
  const payload = { id: user._id, username: user.username, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
};

const buildAuthResponse = (user) => ({ token: issueToken(user), user: toPublicUser(user) });

// Přihlášení uživatelským jménem a heslem.
const loginWithPassword = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || !user.passwordHash) throw new AuthError(401, 'Invalid credentials');
  if (!user.active) throw new AuthError(401, 'User is inactive');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AuthError(401, 'Invalid credentials');
  return buildAuthResponse(user);
};

// Ověří ID token vydaný Googlem pro náš GOOGLE_CLIENT_ID.
const verifyGoogleToken = async (idToken) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new AuthError(500, 'GOOGLE_CLIENT_ID is not configured');
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: clientId });
    return ticket.getPayload();
  } catch (err) {
    throw new AuthError(401, 'Invalid Google token');
  }
};

// Přihlášení přes Google. Při prvním přihlášení uživatele zaregistruje.
const loginWithGoogle = async (idToken) => {
  const profile = await verifyGoogleToken(idToken);
  if (!profile || !profile.sub) throw new AuthError(401, 'Invalid Google token');
  if (!profile.email || !profile.email_verified) throw new AuthError(401, 'Google email is not verified');

  const email = profile.email.toLowerCase();
  let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email }] });

  if (!user) {
    user = new User({
      username: email,
      email,
      name: profile.name || '',
      avatarUrl: profile.picture || '',
      googleId: profile.sub,
      authProvider: 'google',
      role: isAdminEmail(email) ? 'admin' : getDefaultRole()
    });
  } else {
    if (!user.active) throw new AuthError(401, 'User is inactive');
    user.googleId = profile.sub;
    user.email = email;
    user.name = profile.name || user.name;
    user.avatarUrl = profile.picture || user.avatarUrl;
    // E-maily ze seznamu ADMIN_EMAILS jsou vždy admin. Ostatním zůstává role, kterou mají.
    if (isAdminEmail(email)) user.role = 'admin';
  }

  await user.save();
  return buildAuthResponse(user);
};

module.exports = {
  AuthError,
  loginWithPassword,
  loginWithGoogle,
  toPublicUser,
  isAdminEmail,
  getDefaultRole
};
