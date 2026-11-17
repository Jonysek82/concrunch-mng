const express = require('express');
const { listPublicEvents, getPublicEventById, listAdminEvents, createEvent, updateEvent, cancelEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, eventRules, updateEventRules } = require('../utils/validators');
const audit = require('../../../../shared/auditMiddleware');

const router = express.Router();

router.get('/', listPublicEvents);
router.get('/admin', authMiddleware, roleMiddleware(STAFF), listAdminEvents);
router.get('/:id', getPublicEventById);
router.post('/', authMiddleware, roleMiddleware(STAFF), eventRules, handleValidation, audit('event.created', 'event'), createEvent);
router.put('/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'události'), ...updateEventRules], handleValidation, audit('event.updated', 'event'), updateEvent);
router.patch('/:id/cancel', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'události')], handleValidation, audit('event.cancelled', 'event'), cancelEvent);
router.delete('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'události')], handleValidation, audit('event.deleted', 'event'), deleteEvent);

module.exports = router;
