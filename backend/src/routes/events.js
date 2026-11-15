const express = require('express');
const { listPublicEvents, getPublicEventById, listAdminEvents, createEvent, updateEvent, cancelEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, eventRules, updateEventRules } = require('../utils/validators');

const router = express.Router();

router.get('/', listPublicEvents);
router.get('/admin', authMiddleware, roleMiddleware(STAFF), listAdminEvents);
router.get('/:id', getPublicEventById);
router.post('/', authMiddleware, roleMiddleware(STAFF), eventRules, handleValidation, createEvent);
router.put('/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'události'), ...updateEventRules], handleValidation, updateEvent);
router.patch('/:id/cancel', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'události')], handleValidation, cancelEvent);
router.delete('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'události')], handleValidation, deleteEvent);

module.exports = router;
