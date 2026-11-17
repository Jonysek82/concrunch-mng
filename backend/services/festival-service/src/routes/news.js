const express = require('express');
const { listPublicNews, getPublicNewsById, listNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, newsRules, updateNewsRules } = require('../utils/validators');
const audit = require('../../../../shared/auditMiddleware');
const router = express.Router();

router.get('/', listPublicNews);
router.get('/admin', authMiddleware, roleMiddleware(STAFF), listNews);
router.get('/:id', getPublicNewsById);
router.post('/', authMiddleware, roleMiddleware(STAFF), newsRules, handleValidation, audit('news.created', 'news'), createNews);
router.put('/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'článku'), ...updateNewsRules], handleValidation, audit('news.updated', 'news'), updateNews);
router.delete('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'článku')], handleValidation, audit('news.deleted', 'news'), deleteNews);

module.exports = router;
