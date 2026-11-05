const express = require('express');
const { listPublicNews, getPublicNewsById, listNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { handleValidation, objectIdParam, newsRules, updateNewsRules } = require('../utils/validators');
const router = express.Router();

router.get('/', listPublicNews);
router.get('/admin', authMiddleware, roleMiddleware(['organizer','admin']), listNews);
router.get('/:id', getPublicNewsById);
router.post('/', authMiddleware, roleMiddleware(['organizer','admin']), newsRules, handleValidation, createNews);
router.put('/:id', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'článku'), ...updateNewsRules], handleValidation, updateNews);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'článku')], handleValidation, deleteNews);

module.exports = router;
