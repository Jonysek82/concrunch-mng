const express = require('express');
const { listPublicPerformers, getPublicPerformerById, listPerformers, createPerformer, updatePerformer, deletePerformer } = require('../controllers/performerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, performerRules, updatePerformerRules } = require('../utils/validators');
const audit = require('../../../../shared/auditMiddleware');
const router = express.Router();

router.get('/', listPublicPerformers);
router.get('/admin', authMiddleware, roleMiddleware(STAFF), listPerformers);
router.get('/:id', getPublicPerformerById);
router.post('/', authMiddleware, roleMiddleware(STAFF), performerRules, handleValidation, audit('performer.created', 'performer'), createPerformer);
router.put('/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'umělce'), ...updatePerformerRules], handleValidation, audit('performer.updated', 'performer'), updatePerformer);
router.delete('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'umělce')], handleValidation, audit('performer.deleted', 'performer'), deletePerformer);

module.exports = router;
