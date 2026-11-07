const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  actor: {
    type: String,
    default: 'A11y Remediation Agent'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String
  }
}, { _id: false });

const IssueSchema = new mongoose.Schema({
  issueId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  wcagCriterion: {
    type: String,
    required: [true, 'WCAG criterion is required'],
    trim: true
  },
  wcagLevel: {
    type: String,
    enum: ['A', 'AA', 'AAA'],
    default: 'AA'
  },
  severity: {
    type: String,
    enum: ['critical', 'serious', 'moderate', 'minor'],
    required: [true, 'Severity is required'],
    default: 'serious'
  },
  impact: {
    type: String,
    trim: true
  },
  targetUrl: {
    type: String,
    trim: true
  },
  selector: {
    type: String,
    trim: true
  },
  htmlSnippet: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['manual', 'axe-core', 'lighthouse', 'pa11y', 'sample-audit', 'csv-import'],
    default: 'manual'
  },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in_progress', 'ready_for_review', 'verified', 'wont_fix'],
    default: 'backlog',
    index: true
  },
  assignedTo: {
    name: { type: String, default: 'Unassigned' },
    email: { type: String, default: '' },
    role: { type: String, default: 'Frontend Engineer' }
  },
  remediation: {
    suggestedFix: { type: String, default: '' },
    fixSnippet: { type: String, default: '' },
    fixedBy: { type: String, default: '' },
    fixedAt: { type: Date },
    pullRequestUrl: { type: String, default: '' },
    branchOrCommit: { type: String, default: '' }
  },
  verification: {
    status: {
      type: String,
      enum: ['unverified', 'passed', 'failed', 'needs_retest'],
      default: 'unverified'
    },
    verifiedBy: { type: String, default: '' },
    verifiedAt: { type: Date },
    assistiveTechUsed: {
      type: [String],
      default: []
    },
    evidenceNotes: { type: String, default: '' },
    evidenceImageUrl: { type: String, default: '' },
    codeDiffConfirmed: { type: Boolean, default: false },
    screenReaderTested: { type: Boolean, default: false },
    keyboardTested: { type: Boolean, default: false }
  },
  tags: {
    type: [String],
    default: []
  },
  history: [HistorySchema]
}, {
  timestamps: true
});

module.exports = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);

