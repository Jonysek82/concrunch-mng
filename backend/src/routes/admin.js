const express = require('express');
const { listAdminEvents, createEvent, updateEvent, cancelEvent, deleteEvent } = require('../controllers/eventController');
const { listNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, eventRules, updateEventRules, newsRules, updateNewsRules } = require('../utils/validators');
const router = express.Router();

router.get('/events', authMiddleware, roleMiddleware(STAFF), listAdminEvents);
router.post('/events', authMiddleware, roleMiddleware(STAFF), eventRules, handleValidation, createEvent);
router.put('/events/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'události'), ...updateEventRules], handleValidation, updateEvent);
router.patch('/events/:id/cancel', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'události')], handleValidation, cancelEvent);
router.delete('/events/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'události')], handleValidation, deleteEvent);
router.get('/news', authMiddleware, roleMiddleware(STAFF), listNews);
router.post('/news', authMiddleware, roleMiddleware(STAFF), newsRules, handleValidation, createNews);
router.put('/news/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'článku'), ...updateNewsRules], handleValidation, updateNews);
router.delete('/news/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'článku')], handleValidation, deleteNews);

module.exports = router;
