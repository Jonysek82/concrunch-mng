const Event = require('../models/Event');
const Performer = require('../models/Performer');
const Tag = require('../models/Tag');
const { isValidObjectId, dateTimeToValue } = require('../utils/validators');
const { pickEventChanges, mergeEventSchedule, uniqueIds } = require('../utils/eventUpdate');

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

// US4 Úprava/přesun akce – PUT /api/events/:id (i /api/admin/events/:id).
// Organizátor nebo správce změní údaje akce, např. přesune ji na jiný den, čas nebo místo.
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Neplatné ID události' });

    // Bereme jen pole z formuláře „Upravit akci“, ostatní se ignorují.
    const changes = pickEventChanges(req.body);
    if (Object.keys(changes).length === 0) {
      return res.status(400).json({ message: 'Nebyly zadány žádné údaje ke změně' });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Událost nebyla nalezena' });

    // Konec musí být později než začátek – kontrolujeme výsledný stav (uložené údaje + změny),
    // takže kontrola platí i při změně jen jednoho z časů.
    const schedule = mergeEventSchedule(event, changes);
    if (!dateTimeToValue(new Date(schedule.day), schedule.startTime, schedule.endTime)) {
      return res.status(400).json({ message: 'Konec musí být později než začátek' });
    }

    // Přiřazení účinkující a tagy musí existovat.
    if (changes.performerIds) {
      changes.performerIds = uniqueIds(changes.performerIds);
      const count = await Performer.countDocuments({ _id: { $in: changes.performerIds } });
      if (count !== changes.performerIds.length) {
        return res.status(400).json({ message: 'Některý z vybraných účinkujících neexistuje' });
      }
    }
    if (changes.tagIds) {
      changes.tagIds = uniqueIds(changes.tagIds);
      const count = await Tag.countDocuments({ _id: { $in: changes.tagIds } });
      if (count !== changes.tagIds.length) {
        return res.status(400).json({ message: 'Některý z vybraných tagů neexistuje' });
      }
    }

    Object.assign(event, changes, { updatedBy: req.user._id });
    await event.save();
    await event.populate(['performerIds', 'tagIds']);
    res.json(event);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(400).json({ message: err.message });
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
