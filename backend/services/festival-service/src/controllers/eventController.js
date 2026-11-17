const Event = require('../models/Event');
const Performer = require('../models/Performer');
const Tag = require('../models/Tag');
const { isValidObjectId, dateTimeToValue } = require('../utils/validators');

const normalizeEventQuery = (query) => {
  const filters = { status: { $in: ['published', 'cancelled'] } };
  if (query.tag) filters.tagIds = { $in: [query.tag] };
  if (query.day) filters.day = { $gte: new Date(query.day), $lt: new Date(new Date(query.day).getTime() + 86400000) };
  return filters;
};

const listPublicEvents = async (req, res, next) => {
  try {
    const filter = normalizeEventQuery(req.query);
    const events = await Event.find(filter)
      .populate('performerIds')
      .populate('tagIds')
      .sort({ day: 1, startTime: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

const getPublicEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID události' });
    const event = await Event.findOne({ _id: id, status: { $in: ['published', 'cancelled'] } })
      .populate('performerIds')
      .populate('tagIds');
    if (!event) return res.status(404).json({ message: 'Událost nebyla nalezena' });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

const listAdminEvents = async (req, res, next) => {
  try {
    const events = await Event.find({}).populate('performerIds').populate('tagIds').sort({ day: 1, startTime: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, day, startTime, endTime, location, performerIds = [], tagIds = [], status = 'draft' } = req.body;
    if (!dateTimeToValue(new Date(day), startTime, endTime)) {
      return res.status(400).json({ message: 'Konec musí být později než začátek' });
    }
    const event = new Event({
      title,
      description,
      day,
      startTime,
      endTime,
      location,
      performerIds,
      tagIds,
      status,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID události' });
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Událost nebyla nalezena' });
    const nextData = { ...req.body, updatedBy: req.user._id };
    if (nextData.day && nextData.startTime && nextData.endTime) {
      const day = new Date(nextData.day);
      if (!dateTimeToValue(day, nextData.startTime, nextData.endTime)) {
        return res.status(400).json({ message: 'Konec musí být později než začátek' });
      }
    }
    Object.assign(event, nextData);
    await event.save();
    res.json(event);
  } catch (err) {
    next(err);
  }
};

const cancelEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Událost nebyla nalezena' });
    event.status = 'cancelled';
    event.cancellationReason = cancellationReason || '';
    event.updatedBy = req.user._id;
    await event.save();
    res.json(event);
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: 'Událost nebyla nalezena' });
    res.json({ message: 'Událost smazána' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPublicEvents, getPublicEventById, listAdminEvents, createEvent, updateEvent, cancelEvent, deleteEvent };
