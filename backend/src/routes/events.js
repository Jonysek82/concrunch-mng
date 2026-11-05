const express = require('express');
const { listPublicEvents, getPublicEventById, listAdminEvents, createEvent, updateEvent, cancelEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { handleValidation, objectIdParam, eventRules, updateEventRules } = require('../utils/validators');

const router = express.Router();

router.get('/', listPublicEvents);
router.get('/admin', authMiddleware, roleMiddleware(['organizer','admin']), listAdminEvents);
router.get('/:id', getPublicEventById);
router.post('/', authMiddleware, roleMiddleware(['organizer','admin']), eventRules, handleValidation, createEvent);
router.put('/:id', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'události'), ...updateEventRules], handleValidation, updateEvent);
router.patch('/:id/cancel', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'události')], handleValidation, cancelEvent);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'události')], handleValidation, deleteEvent);

module.exports = router;
