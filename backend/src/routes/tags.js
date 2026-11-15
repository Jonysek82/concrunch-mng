const express = require('express');
const { listTags, createTag, updateTag, deleteTag } = require('../controllers/tagController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, tagRules, updateTagRules } = require('../utils/validators');
const router = express.Router();

router.get('/', listTags);
router.post('/', authMiddleware, roleMiddleware(STAFF), tagRules, handleValidation, createTag);
router.put('/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'tagu'), ...updateTagRules], handleValidation, updateTag);
router.delete('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'tagu')], handleValidation, deleteTag);

module.exports = router;
