const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array().map((e) => ({ field: e.param, message: e.msg })) });
  }
  next();
};

const isValidObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(value);

const objectIdParam = (fieldName = 'id', label = 'položky') =>
  param(fieldName)
    .custom((value) => isValidObjectId(value))
    .withMessage(`Neplatné ID ${label}`);

const dateTimeToValue = (day, startTime, endTime) => {
  if (!day || !startTime || !endTime) return true;
  const dateValue = day instanceof Date ? day : new Date(day);
  if (Number.isNaN(dateValue.getTime())) return false;
  const s = new Date(`${dateValue.toISOString().slice(0, 10)}T${startTime}:00`);
  const e = new Date(`${dateValue.toISOString().slice(0, 10)}T${endTime}:00`);
  return s < e;
};

const eventRules = [
  body('title').trim().notEmpty().withMessage('Název je povinný'),
  body('description').notEmpty().withMessage('Popis je povinný'),
  body('day').isISO8601().withMessage('Datum je povinné'),
  body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Začátek musí být ve formátu HH:MM'),
  body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('Konec musí být ve formátu HH:MM'),
  body('location').trim().notEmpty().withMessage('Místo je povinné'),
  body('status').optional().isIn(['draft','published','cancelled']).withMessage('Neplatný stav'),
  body('performerIds').optional().isArray().withMessage('performerIds musí být pole'),
  body('tagIds').optional().isArray().withMessage('tagIds musí být pole')
];

const updateEventRules = [
  body('title').optional().trim().notEmpty().withMessage('Název je povinný'),
  body('description').optional().notEmpty().withMessage('Popis je povinný'),
  body('day').optional().isISO8601().withMessage('Datum je povinné'),
  body('startTime').optional().matches(/^\d{2}:\d{2}$/).withMessage('Začátek musí být ve formátu HH:MM'),
  body('endTime').optional().matches(/^\d{2}:\d{2}$/).withMessage('Konec musí být ve formátu HH:MM'),
  body('location').optional().trim().notEmpty().withMessage('Místo je povinné'),
  body('status').optional().isIn(['draft','published','cancelled']).withMessage('Neplatný stav'),
  body('performerIds').optional().isArray().withMessage('performerIds musí být pole'),
  body('tagIds').optional().isArray().withMessage('tagIds musí být pole')
];

const newsRules = [
  body('title').trim().notEmpty().withMessage('Titulek je povinný'),
  body('content').notEmpty().withMessage('Obsah je povinný'),
  body('status').optional().isIn(['draft','published']).withMessage('Neplatný stav')
];

const updateNewsRules = [
  body('title').optional().trim().notEmpty().withMessage('Titulek je povinný'),
  body('content').optional().notEmpty().withMessage('Obsah je povinný'),
  body('status').optional().isIn(['draft','published']).withMessage('Neplatný stav')
];

const performerRules = [
  body('name').trim().notEmpty().withMessage('Jméno je povinné'),
  body('bio').notEmpty().withMessage('Bio je povinné')
];

const updatePerformerRules = [
  body('name').optional().trim().notEmpty().withMessage('Jméno je povinné'),
  body('bio').optional().notEmpty().withMessage('Bio je povinné')
];

const merchantRules = [
  body('name').trim().notEmpty().withMessage('Jméno je povinné'),
  body('description').notEmpty().withMessage('Popis je povinný')
];

const updateMerchantRules = [
  body('name').optional().trim().notEmpty().withMessage('Jméno je povinné'),
  body('description').optional().notEmpty().withMessage('Popis je povinný')
];

const tagRules = [
  body('name').trim().notEmpty().withMessage('Název tagu je povinný')
];

const updateTagRules = [
  body('name').optional().trim().notEmpty().withMessage('Název tagu je povinný')
];

const userRules = [
  body('username').trim().isLength({ min: 3 }).withMessage('Uživatelské jméno musí mít alespoň 3 znaky'),
  body('password').isLength({ min: 8 }).withMessage('Heslo musí mít alespoň 8 znaků'),
  body('role').optional().isIn(['visitor','organizer','admin']).withMessage('Neplatná role')
];

const updateUserRules = [
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Uživatelské jméno musí mít alespoň 3 znaky'),
  body('password').optional().isLength({ min: 8 }).withMessage('Heslo musí mít alespoň 8 znaků'),
  body('role').optional().isIn(['visitor','organizer','admin']).withMessage('Neplatná role'),
  body('active').optional().isBoolean().withMessage('Aktivní musí být boolean')
];

const organizerRequestRules = [
  body('message').optional().isString().isLength({ max: 500 }).withMessage('Zpráva může mít nejvýše 500 znaků')
];

const organizerDecisionRules = [
  body('decision').isIn(['approved','rejected']).withMessage('Rozhodnutí musí být approved nebo rejected'),
  body('rejectionReason').optional().isString().isLength({ max: 500 }).withMessage('Důvod zamítnutí může mít nejvýše 500 znaků')
];

const organizerRequestListRules = [
  query('status').optional().isIn(['pending','approved','rejected']).withMessage('Neplatný stav žádosti')
];

const googleLoginRules = [
  body('credential').isString().notEmpty().withMessage('Google token je povinný')
];

module.exports = {
  handleValidation,
  isValidObjectId,
  objectIdParam,
  dateTimeToValue,
  eventRules,
  updateEventRules,
  newsRules,
  updateNewsRules,
  performerRules,
  updatePerformerRules,
  merchantRules,
  updateMerchantRules,
  tagRules,
  updateTagRules,
  userRules,
  updateUserRules,
  googleLoginRules,
  organizerRequestRules,
  organizerDecisionRules,
  organizerRequestListRules
};
