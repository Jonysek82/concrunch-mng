const Performer = require('../models/Performer');
const { isValidObjectId } = require('../utils/validators');

const listPublicPerformers = async (req, res, next) => {
  try {
    const performers = await Performer.find({ published: true }).populate('tagIds').sort({ name: 1 });
    res.json(performers);
  } catch (err) {
    next(err);
  }
};

const getPublicPerformerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID interpreta' });
    const performer = await Performer.findOne({ _id: id, published: true }).populate('tagIds');
    if (!performer) return res.status(404).json({ message: 'Interpret nebyl nalezen' });
    res.json(performer);
  } catch (err) {
    next(err);
  }
};

const listPerformers = async (req, res, next) => {
  try {
    const performers = await Performer.find({}).populate('tagIds').sort({ name: 1 });
    res.json(performers);
  } catch (err) {
    next(err);
  }
};

const createPerformer = async (req, res, next) => {
  try {
    const performer = new Performer({ ...req.body, published: req.body.published !== undefined ? req.body.published : true });
    await performer.save();
    res.status(201).json(performer);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    next(err);
  }
};

const updatePerformer = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID interpreta' });
    const performer = await Performer.findById(id);
    if (!performer) return res.status(404).json({ message: 'Interpret nebyl nalezen' });
    Object.assign(performer, req.body);
    await performer.save();
    res.json(performer);
  } catch (err) {
    next(err);
  }
};

const deletePerformer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const performer = await Performer.findByIdAndDelete(id);
    if (!performer) return res.status(404).json({ message: 'Interpret nebyl nalezen' });
    res.json({ message: 'Interpret smazán' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPublicPerformers, getPublicPerformerById, listPerformers, createPerformer, updatePerformer, deletePerformer };
