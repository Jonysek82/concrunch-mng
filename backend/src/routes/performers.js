const express = require('express');
const { listPublicPerformers, getPublicPerformerById, listPerformers, createPerformer, updatePerformer, deletePerformer } = require('../controllers/performerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { handleValidation, objectIdParam, performerRules, updatePerformerRules } = require('../utils/validators');
const router = express.Router();

router.get('/', listPublicPerformers);
router.get('/admin', authMiddleware, roleMiddleware(['organizer','admin']), listPerformers);
router.get('/:id', getPublicPerformerById);
router.post('/', authMiddleware, roleMiddleware(['organizer','admin']), performerRules, handleValidation, createPerformer);
router.put('/:id', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'umělce'), ...updatePerformerRules], handleValidation, updatePerformer);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'umělce')], handleValidation, deletePerformer);

module.exports = router;
