const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const {
  validateIssueCreation,
  validateStatusUpdate,
  validateVerificationPayload,
  validateBatchImport
} = require('../middleware/validator');

// Issue CRUD
router.get('/', issueController.getIssues);
router.post('/', validateIssueCreation, issueController.createIssue);
router.get('/:id', issueController.getIssueById);
router.put('/:id', issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);

// Specialized remediation workflow routes
router.patch('/:id/status', validateStatusUpdate, issueController.updateStatus);
router.patch('/:id/verify', validateVerificationPayload, issueController.recordVerification);

// Sample report and batch import routes
router.post('/import', validateBatchImport, issueController.importBatchIssues);
router.post('/seed-sample', issueController.seedSample);
router.post('/reset', issueController.resetDefaults);

module.exports = router;

