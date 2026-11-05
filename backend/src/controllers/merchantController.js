const Merchant = require('../models/Merchant');
const { isValidObjectId } = require('../utils/validators');

const listPublicMerchants = async (req, res, next) => {
  try {
    const merchants = await Merchant.find({ published: true }).populate('tagIds').sort({ name: 1 });
    res.json(merchants);
  } catch (err) {
    next(err);
  }
};

const getPublicMerchantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID prodejce' });
    const merchant = await Merchant.findOne({ _id: id, published: true }).populate('tagIds');
    if (!merchant) return res.status(404).json({ message: 'Prodejce nebyl nalezen' });
    res.json(merchant);
  } catch (err) {
    next(err);
  }
};

const listMerchants = async (req, res, next) => {
  try {
    const merchants = await Merchant.find({}).populate('tagIds').sort({ name: 1 });
    res.json(merchants);
  } catch (err) {
    next(err);
  }
};

const createMerchant = async (req, res, next) => {
  try {
    const merchant = new Merchant({ ...req.body, published: req.body.published !== undefined ? req.body.published : true });
    await merchant.save();
    res.status(201).json(merchant);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    next(err);
  }
};

const updateMerchant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID prodejce' });
    const merchant = await Merchant.findById(id);
    if (!merchant) return res.status(404).json({ message: 'Prodejce nebyl nalezen' });
    Object.assign(merchant, req.body);
    await merchant.save();
    res.json(merchant);
  } catch (err) {
    next(err);
  }
};

const deleteMerchant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const merchant = await Merchant.findByIdAndDelete(id);
    if (!merchant) return res.status(404).json({ message: 'Prodejce nebyl nalezen' });
    res.json({ message: 'Prodejce smazán' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPublicMerchants, getPublicMerchantById, listMerchants, createMerchant, updateMerchant, deleteMerchant };
