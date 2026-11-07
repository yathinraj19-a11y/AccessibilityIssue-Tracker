// Input validation middleware for Accessibility Issues
const validateIssueCreation = (req, res, next) => {
  const { title, description, wcagCriterion, severity } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string.');
  } else if (title.trim().length > 200) {
    errors.push('Title must not exceed 200 characters.');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required.');
  }

  if (!wcagCriterion || typeof wcagCriterion !== 'string' || wcagCriterion.trim().length === 0) {
    errors.push('WCAG criterion is required (e.g., "1.4.3 Contrast (Minimum)").');
  }

  const validSeverities = ['critical', 'serious', 'moderate', 'minor'];
  if (severity && !validSeverities.includes(severity.toLowerCase())) {
    errors.push(`Severity must be one of: ${validSeverities.join(', ')}.`);
  }

  const validLevels = ['A', 'AA', 'AAA'];
  if (req.body.wcagLevel && !validLevels.includes(req.body.wcagLevel.toUpperCase())) {
    errors.push(`WCAG Level must be one of: ${validLevels.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['backlog', 'todo', 'in_progress', 'ready_for_review', 'verified', 'wont_fix'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}.`
    });
  }

  next();
};

const validateVerificationPayload = (req, res, next) => {
  const { verifiedBy, evidenceNotes, assistiveTechUsed } = req.body;
  const errors = [];

  if (!verifiedBy || typeof verifiedBy !== 'string' || verifiedBy.trim().length === 0) {
    errors.push('Verifier name/role ("verifiedBy") is required to sign off.');
  }

  if (!evidenceNotes || typeof evidenceNotes !== 'string' || evidenceNotes.trim().length < 5) {
    errors.push('Verification evidence notes must provide at least 5 characters detailing the re-test procedure.');
  }

  if (assistiveTechUsed && !Array.isArray(assistiveTechUsed)) {
    errors.push('assistiveTechUsed must be an array of strings (e.g. ["NVDA", "VoiceOver", "Keyboard Only"]).');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Verification submission validation failed',
      errors
    });
  }

  next();
};

const validateBatchImport = (req, res, next) => {
  const { issues } = req.body;

  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Batch import expects a non-empty "issues" array.'
    });
  }

  // Validate at least the first item has title
  const invalidItems = issues.filter(i => !i.title || !i.wcagCriterion);
  if (invalidItems.length > 0) {
    return res.status(400).json({
      success: false,
      message: `${invalidItems.length} issue(s) are missing required fields "title" or "wcagCriterion".`
    });
  }

  next();
};

module.exports = {
  validateIssueCreation,
  validateStatusUpdate,
  validateVerificationPayload,
  validateBatchImport
};

