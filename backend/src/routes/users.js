const express = require('express');
const { listUsers, createUser, updateUser, updateUserRole, updateUserStatus } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ADMIN_ONLY, ROLE_LIST } = require('../utils/roles');
const { createOrganizerRequest, getMyOrganizerRequest, listOrganizerRequests, decideOrganizerRequest } = require('../controllers/organizerRequestController');
const { handleValidation, objectIdParam, userRules, updateUserRules, organizerRequestRules, organizerDecisionRules, organizerRequestListRules } = require('../utils/validators');
const { body } = require('express-validator');
const router = express.Router();

// Schválení organizátora
router.post('/me/organizer-request', authMiddleware, organizerRequestRules, handleValidation, createOrganizerRequest);
router.get('/me/organizer-request', authMiddleware, getMyOrganizerRequest);
router.get('/organizer-requests', authMiddleware, roleMiddleware(ADMIN_ONLY), organizerRequestListRules, handleValidation, listOrganizerRequests);
router.patch('/:id/organizer-request', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), ...organizerDecisionRules], handleValidation, decideOrganizerRequest);

router.get('/', authMiddleware, roleMiddleware(ADMIN_ONLY), listUsers);
router.post('/', authMiddleware, roleMiddleware(ADMIN_ONLY), userRules, handleValidation, createUser);
router.put('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), ...updateUserRules], handleValidation, updateUser);
router.patch('/:id/role', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), body('role').isIn(ROLE_LIST).withMessage('Neplatná role')], handleValidation, updateUserRole);
router.patch('/:id/status', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), body('active').isBoolean().withMessage('Aktivní musí být boolean')], handleValidation, updateUserStatus);

module.exports = router;
