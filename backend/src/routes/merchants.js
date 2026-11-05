const express = require('express');
const { listPublicMerchants, getPublicMerchantById, listMerchants, createMerchant, updateMerchant, deleteMerchant } = require('../controllers/merchantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { handleValidation, objectIdParam, merchantRules, updateMerchantRules } = require('../utils/validators');
const router = express.Router();

router.get('/', listPublicMerchants);
router.get('/admin', authMiddleware, roleMiddleware(['organizer','admin']), listMerchants);
router.get('/:id', getPublicMerchantById);
router.post('/', authMiddleware, roleMiddleware(['organizer','admin']), merchantRules, handleValidation, createMerchant);
router.put('/:id', authMiddleware, roleMiddleware(['organizer','admin']), [objectIdParam('id', 'obchodu'), ...updateMerchantRules], handleValidation, updateMerchant);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'obchodu')], handleValidation, deleteMerchant);

module.exports = router;
