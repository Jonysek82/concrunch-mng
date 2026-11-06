const express = require('express');
const { listUsers, createUser, updateUser, updateUserRole, updateUserStatus } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createOrganizerRequest, getMyOrganizerRequest, listOrganizerRequests, decideOrganizerRequest } = require('../controllers/organizerRequestController');
const { handleValidation, objectIdParam, userRules, updateUserRules, organizerRequestRules, organizerDecisionRules, organizerRequestListRules } = require('../utils/validators');
const { body } = require('express-validator');
const router = express.Router();

// Schválení organizátora
router.post('/me/organizer-request', authMiddleware, organizerRequestRules, handleValidation, createOrganizerRequest);
router.get('/me/organizer-request', authMiddleware, getMyOrganizerRequest);
router.get('/organizer-requests', authMiddleware, roleMiddleware(['admin']), organizerRequestListRules, handleValidation, listOrganizerRequests);
router.patch('/:id/organizer-request', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'uživatele'), ...organizerDecisionRules], handleValidation, decideOrganizerRequest);

router.get('/', authMiddleware, roleMiddleware(['admin']), listUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), userRules, handleValidation, createUser);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'uživatele'), ...updateUserRules], handleValidation, updateUser);
router.patch('/:id/role', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'uživatele'), body('role').isIn(['visitor','organizer','admin']).withMessage('Neplatná role')], handleValidation, updateUserRole);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), [objectIdParam('id', 'uživatele'), body('active').isBoolean().withMessage('Aktivní musí být boolean')], handleValidation, updateUserStatus);

module.exports = router;
