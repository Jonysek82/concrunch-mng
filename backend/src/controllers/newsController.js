const News = require('../models/News');
const User = require('../models/User');
const { isValidObjectId } = require('../utils/validators');

const listPublicNews = async (req, res, next) => {
  try {
    const items = await News.find({ status: 'published' }).populate('authorId', 'username').sort({ publishedAt: -1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const getPublicNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID článku' });
    const item = await News.findOne({ _id: id, status: 'published' }).populate('authorId', 'username');
    if (!item) return res.status(404).json({ message: 'Článek nebyl nalezen' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const listNews = async (req, res, next) => {
  try {
    const items = await News.find({}).populate('authorId', 'username').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const createNews = async (req, res, next) => {
  try {
    const { title, content, status = 'draft', publishedAt } = req.body;
    const item = new News({ title, content, status, publishedAt: status === 'published' ? publishedAt || new Date() : null, authorId: req.user._id });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    next(err);
  }
};

const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID článku' });
    const item = await News.findById(id);
    if (!item) return res.status(404).json({ message: 'Článek nebyl nalezen' });
    const nextData = { ...req.body };
    if (nextData.status === 'published' && !item.publishedAt) nextData.publishedAt = new Date();
    if (nextData.status === 'draft') nextData.publishedAt = null;
    Object.assign(item, nextData);
    await item.save();
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await News.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Článek nebyl nalezen' });
    res.json({ message: 'Článek smazán' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPublicNews, getPublicNewsById, listNews, createNews, updateNews, deleteNews };
