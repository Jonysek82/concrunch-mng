const express = require('express');
const { listAdminEvents, createEvent, updateEvent, cancelEvent, deleteEvent } = require('../controllers/eventController');
const { listNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { handleValidation, objectIdParam, eventRules, updateEventRules, newsRules, updateNewsRules } = require('../utils/validators');
const router = express.Router();

router.get('/events', authMiddleware, roleMiddleware(['organizer','admin']), listAdminEvents);
router.post('/events', authMiddleware, roleMiddleware(['organizer','admin']), eventRules, handleValidation, createEvent);
router.put('/events/:id', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'události'), ...updateEventRules], handleValidation, updateEvent);
router.patch('/events/:id/cancel', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'události')], handleValidation, cancelEvent);
router.delete('/events/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'události')], handleValidation, deleteEvent);
router.get('/news', authMiddleware, roleMiddleware(['organizer','admin']), listNews);
router.post('/news', authMiddleware, roleMiddleware(['organizer','admin']), newsRules, handleValidation, createNews);
router.put('/news/:id', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'článku'), ...updateNewsRules], handleValidation, updateNews);
router.delete('/news/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'článku')], handleValidation, deleteNews);

module.exports = router;
