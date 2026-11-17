const { AuthError, loginWithPassword, loginWithGoogle, toPublicUser } = require('../services/authService');

const handleAuthError = (err, res, next) => {
  if (err instanceof AuthError) return res.status(err.status).json({ message: err.message });
  next(err);
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });
    res.json(await loginWithPassword(username, password));
  } catch (err) {
    handleAuthError(err, res, next);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    res.json(await loginWithGoogle(req.body.credential));
  } catch (err) {
    handleAuthError(err, res, next);
  }
};

const me = async (req, res) => {
  res.json(toPublicUser(req.user));
};

module.exports = { login, googleLogin, me };
