const Tag = require('../models/Tag');
const { isValidObjectId } = require('../utils/validators');

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

const listTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({}).sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name, color = '#8b5cf6', type = 'general' } = req.body;
    const slug = slugify(name || '');
    if (!name || !slug) return res.status(400).json({ message: 'Název tagu je povinný' });
    const existing = await Tag.findOne({ $or: [{ name }, { slug }] });
    if (existing) return res.status(409).json({ message: 'Tag s tímto názvem nebo slugem již existuje' });
    const tag = new Tag({ name, slug, color, type });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    next(err);
  }
};

const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID tagu' });
    const tag = await Tag.findById(id);
    if (!tag) return res.status(404).json({ message: 'Tag nebyl nalezen' });
    const newName = req.body.name || tag.name;
    const slug = slugify(newName);
    const duplicate = await Tag.findOne({ _id: { $ne: id }, $or: [{ name: newName }, { slug }] });
    if (duplicate) return res.status(409).json({ message: 'Tag s tímto názvem nebo slugem již existuje' });
    tag.name = newName;
    tag.slug = slug;
    if (req.body.color) tag.color = req.body.color;
    if (req.body.type) tag.type = req.body.type;
    await tag.save();
    res.json(tag);
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) return res.status(404).json({ message: 'Tag nebyl nalezen' });
    res.json({ message: 'Tag smazán' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listTags, createTag, updateTag, deleteTag };
