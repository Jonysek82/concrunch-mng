const { body, param, query, validationResult } = require('express-validator');
const { ROLE_LIST } = require('./roles');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((error) => ({ field: error.param, message: error.msg }))
    });
  }
  next();
};

const isValidObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(value);
const objectIdParam = (fieldName = 'id', label = 'položky') =>
  param(fieldName).custom(isValidObjectId).withMessage(`Neplatné ID ${label}`);

const userRules = [
  body('username').trim().isLength({ min: 3 }).withMessage('Uživatelské jméno musí mít alespoň 3 znaky'),
  body('password').isLength({ min: 8 }).withMessage('Heslo musí mít alespoň 8 znaků'),
  body('role').optional().isIn(ROLE_LIST).withMessage('Neplatná role')
];

const updateUserRules = [
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Uživatelské jméno musí mít alespoň 3 znaky'),
  body('password').optional().isLength({ min: 8 }).withMessage('Heslo musí mít alespoň 8 znaků'),
  body('role').optional().isIn(ROLE_LIST).withMessage('Neplatná role'),
  body('active').optional().isBoolean().withMessage('Aktivní musí být boolean')
];

const organizerRequestRules = [
  body('message').optional().isString().isLength({ max: 500 }).withMessage('Zpráva může mít nejvýše 500 znaků')
];

const organizerDecisionRules = [
  body('decision').isIn(['approved', 'rejected']).withMessage('Rozhodnutí musí být approved nebo rejected'),
  body('rejectionReason').optional().isString().isLength({ max: 500 }).withMessage('Důvod zamítnutí může mít nejvýše 500 znaků')
];

const organizerRequestListRules = [
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Neplatný stav žádosti')
];

const googleLoginRules = [
  body('credential').isString().notEmpty().withMessage('Google token je povinný')
];

module.exports = {
  handleValidation,
  isValidObjectId,
  objectIdParam,
  userRules,
  updateUserRules,
  googleLoginRules,
  organizerRequestRules,
  organizerDecisionRules,
  organizerRequestListRules
};
