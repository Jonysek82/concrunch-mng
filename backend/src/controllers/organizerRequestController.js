const User = require('../models/User');
const { isValidObjectId } = require('../utils/validators');

const toRequestResponse = (user) => ({
  id: user._id,
  username: user.username,
  role: user.role,
  organizerRequest: user.organizerRequest || { status: 'none' }
});

// Přihlášený návštěvník požádá o roli organizátora.
const createOrganizerRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen' });
    if (user.role !== 'visitor') return res.status(409).json({ message: 'O roli organizátora může požádat jen návštěvník' });
    if (user.organizerRequest && user.organizerRequest.status === 'pending') {
      return res.status(409).json({ message: 'Žádost již čeká na schválení' });
    }
    user.organizerRequest = {
      status: 'pending',
      message: req.body.message || '',
      requestedAt: new Date(),
      decidedAt: undefined,
      decidedBy: undefined,
      rejectionReason: ''
    };
    await user.save();
    res.status(201).json(toRequestResponse(user));
  } catch (err) {
    next(err);
  }
};

// Přihlášený uživatel zjistí stav své žádosti.
const getMyOrganizerRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen' });
    res.json(toRequestResponse(user));
  } catch (err) {
    next(err);
  }
};

// Admin vypíše žádosti, výchozí jsou ty čekající.
const listOrganizerRequests = async (req, res, next) => {
  try {
    const status = req.query.status || 'pending';
    const users = await User.find({ 'organizerRequest.status': status })
      .select('-passwordHash')
      .sort({ 'organizerRequest.requestedAt': 1 });
    res.json(users.map(toRequestResponse));
  } catch (err) {
    next(err);
  }
};

// Admin žádost schválí, nebo zamítne. Schválení nastaví roli organizer.
const decideOrganizerRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, rejectionReason = '' } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID uživatele' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Uživatel nebyl nalezen' });
    if (!user.organizerRequest || user.organizerRequest.status !== 'pending') {
      return res.status(409).json({ message: 'Uživatel nemá žádost čekající na schválení' });
    }
    user.organizerRequest.status = decision;
    user.organizerRequest.decidedAt = new Date();
    user.organizerRequest.decidedBy = req.user._id;
    user.organizerRequest.rejectionReason = decision === 'rejected' ? rejectionReason : '';
    if (decision === 'approved') user.role = 'organizer';
    await user.save();
    res.json(toRequestResponse(user));
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrganizerRequest, getMyOrganizerRequest, listOrganizerRequests, decideOrganizerRequest };
