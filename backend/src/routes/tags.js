const express = require('express');
const { listTags, createTag, updateTag, deleteTag } = require('../controllers/tagController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { handleValidation, objectIdParam, tagRules, updateTagRules } = require('../utils/validators');
const router = express.Router();

router.get('/', listTags);
router.post('/', authMiddleware, roleMiddleware(['organizer','admin']), tagRules, handleValidation, createTag);
router.put('/:id', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'tagu'), ...updateTagRules], handleValidation, updateTag);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'tagu')], handleValidation, deleteTag);

module.exports = router;
