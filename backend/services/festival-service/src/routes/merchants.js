const express = require('express');
const { listPublicMerchants, getPublicMerchantById, listMerchants, createMerchant, updateMerchant, deleteMerchant } = require('../controllers/merchantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { STAFF, ADMIN_ONLY } = require('../utils/roles');
const { handleValidation, objectIdParam, merchantRules, updateMerchantRules } = require('../utils/validators');
const audit = require('../../../../shared/auditMiddleware');
const router = express.Router();

router.get('/', listPublicMerchants);
router.get('/admin', authMiddleware, roleMiddleware(STAFF), listMerchants);
router.get('/:id', getPublicMerchantById);
router.post('/', authMiddleware, roleMiddleware(STAFF), merchantRules, handleValidation, audit('merchant.created', 'merchant'), createMerchant);
router.put('/:id', authMiddleware, roleMiddleware(STAFF), [objectIdParam('id', 'obchodu'), ...updateMerchantRules], handleValidation, audit('merchant.updated', 'merchant'), updateMerchant);
router.delete('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'obchodu')], handleValidation, audit('merchant.deleted', 'merchant'), deleteMerchant);

module.exports = router;
