const express = require('express');
const { listUsers, createUser, updateUser, updateUserRole, updateUserStatus } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ADMIN_ONLY, ROLE_LIST } = require('../utils/roles');
const { createOrganizerRequest, getMyOrganizerRequest, listOrganizerRequests, decideOrganizerRequest } = require('../controllers/organizerRequestController');
const { handleValidation, objectIdParam, userRules, updateUserRules, organizerRequestRules, organizerDecisionRules, organizerRequestListRules } = require('../utils/validators');
const { body } = require('express-validator');
const audit = require('../../../../shared/auditMiddleware');
const router = express.Router();

// Schválení organizátora
router.post('/me/organizer-request', authMiddleware, organizerRequestRules, handleValidation, audit('identity.organizer_request.created', 'user'), createOrganizerRequest);
router.get('/me/organizer-request', authMiddleware, getMyOrganizerRequest);
router.get('/organizer-requests', authMiddleware, roleMiddleware(ADMIN_ONLY), organizerRequestListRules, handleValidation, listOrganizerRequests);
router.patch('/:id/organizer-request', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), ...organizerDecisionRules], handleValidation, audit('identity.organizer_request.decided', 'user'), decideOrganizerRequest);

router.get('/', authMiddleware, roleMiddleware(ADMIN_ONLY), listUsers);
router.post('/', authMiddleware, roleMiddleware(ADMIN_ONLY), userRules, handleValidation, audit('identity.user.created', 'user'), createUser);
router.put('/:id', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), ...updateUserRules], handleValidation, audit('identity.user.updated', 'user'), updateUser);
router.patch('/:id/role', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), body('role').isIn(ROLE_LIST).withMessage('Neplatná role')], handleValidation, audit('identity.user.role_changed', 'user'), updateUserRole);
router.patch('/:id/status', authMiddleware, roleMiddleware(ADMIN_ONLY), [objectIdParam('id', 'uživatele'), body('active').isBoolean().withMessage('Aktivní musí být boolean')], handleValidation, audit('identity.user.status_changed', 'user'), updateUserStatus);

module.exports = router;
