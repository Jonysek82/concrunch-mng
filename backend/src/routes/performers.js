const express = require('express');
const { listPublicPerformers, getPublicPerformerById, listPerformers, createPerformer, updatePerformer, deletePerformer } = require('../controllers/performerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, performerRules, updatePerformerRules } = require('../utils/validators');
const router = express.Router();

router.get('/', listPublicPerformers);
router.get('/admin', authMiddleware, roleMiddleware(STAFF), listPerformers);
router.get('/:id', getPublicPerformerById);
router.post('/', authMiddleware, roleMiddleware(STAFF), performerRules, handleValidation, createPerformer);
router.put('/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'umělce'), ...updatePerformerRules], handleValidation, updatePerformer);
router.delete('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'umělce')], handleValidation, deletePerformer);

module.exports = router;
