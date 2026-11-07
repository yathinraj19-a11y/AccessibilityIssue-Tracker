const issueService = require('../services/issueService');

// @desc Get all issues with optional filtering, search, sorting
// @route GET /api/issues
const getIssues = async (req, res, next) => {
  try {
    const issues = await issueService.getAllIssues(req.query);
    res.json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single issue by ID or issueId
// @route GET /api/issues/:id
const getIssueById = async (req, res, next) => {
  try {
    const issue = await issueService.getIssueById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID ${req.params.id} not found`
      });
    }
    res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create new accessibility issue
// @route POST /api/issues
const createIssue = async (req, res, next) => {
  try {
    const newIssue = await issueService.createIssue(req.body);
    res.status(201).json({
      success: true,
      message: 'Accessibility issue created successfully',
      data: newIssue
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update accessibility issue
// @route PUT /api/issues/:id
const updateIssue = async (req, res, next) => {
  try {
    const updated = await issueService.updateIssue(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID ${req.params.id} not found`
      });
    }
    res.json({
      success: true,
      message: 'Issue updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update issue status (Backlog -> Todo -> In Progress -> Ready for Review -> Verified)
// @route PATCH /api/issues/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const { status, notes, actor } = req.body;
    const updated = await issueService.updateIssueStatus(req.params.id, status, notes, actor);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID ${req.params.id} not found`
      });
    }
    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc Submit verification evidence (signing off with screen reader / keyboard test notes)
// @route PATCH /api/issues/:id/verify
const recordVerification = async (req, res, next) => {
  try {
    const updated = await issueService.recordVerificationEvidence(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID ${req.params.id} not found`
      });
    }
    res.json({
      success: true,
      message: 'Verification evidence recorded successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete an issue
// @route DELETE /api/issues/:id
const deleteIssue = async (req, res, next) => {
  try {
    const deleted = await issueService.deleteIssue(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID ${req.params.id} not found`
      });
    }
    res.json({
      success: true,
      message: 'Issue deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

// @desc Import batch of issues from axe-core, lighthouse, or custom JSON
// @route POST /api/issues/import
const importBatchIssues = async (req, res, next) => {
  try {
    const { issues, sourceName } = req.body;
    const imported = await issueService.importBatch(issues, sourceName || 'batch-import');
    res.status(201).json({
      success: true,
      message: `Successfully imported ${imported.length} accessibility issues`,
      data: imported
    });
  } catch (error) {
    next(error);
  }
};

// @desc Seed a sample audit report (ecommerce, saas)
// @route POST /api/issues/seed-sample
const seedSample = async (req, res, next) => {
  try {
    const { auditKey = 'ecommerce' } = req.body;
    const seeded = await issueService.seedSampleAudit(auditKey);
    res.status(201).json({
      success: true,
      message: `Successfully seeded ${seeded.length} sample issues from "${auditKey}" audit`,
      data: seeded
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset board to default demo state
// @route POST /api/issues/reset
const resetDefaults = async (req, res, next) => {
  try {
    const result = await issueService.resetAndSeedDefaults();
    res.json({
      success: true,
      message: 'Board reset to default sample audits',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  updateStatus,
  recordVerification,
  deleteIssue,
  importBatchIssues,
  seedSample,
  resetDefaults
};

