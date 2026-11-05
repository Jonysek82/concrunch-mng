const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isValidObjectId } = require('../utils/validators');

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ username: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, password, role = 'organizer', active = true } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Uživatelské jméno a heslo jsou povinné' });
    if (password.length < 8) return res.status(400).json({ message: 'Heslo musí mít alespoň 8 znaků' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'Uživatelské jméno již existuje' });
    const user = new User({ username, passwordHash: await bcrypt.hash(password, 10), role, active });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, role: user.role, active: user.active });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID uživatele' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen' });
    if (req.body.username) user.username = req.body.username;
    if (req.body.password) user.passwordHash = await bcrypt.hash(req.body.password, 10);
    if (req.body.active !== undefined) user.active = req.body.active;
    await user.save();
    res.json({ id: user._id, username: user.username, role: user.role, active: user.active });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID uživatele' });
    if (!['visitor','organizer','admin'].includes(role)) return res.status(400).json({ message: 'Neplatná role' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen' });
    user.role = role;
    await user.save();
    res.json({ id: user._id, username: user.username, role: user.role, active: user.active });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID uživatele' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen' });
    user.active = !!active;
    await user.save();
    res.json({ id: user._id, username: user.username, role: user.role, active: user.active });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, createUser, updateUser, updateUserRole, updateUserStatus };
