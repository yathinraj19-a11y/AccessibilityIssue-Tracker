const Issue = require('../models/Issue');
const { getDbStatus } = require('../config/db');
const { sampleAudits } = require('../data/sampleReports');

// In-memory backing array when MongoDB is not connected
let memoryIssues = [];

const initializeMemoryStoreIfNeeded = () => {
  if (memoryIssues.length === 0) {
    const seed = [
      ...sampleAudits.ecommerce.issues,
      ...sampleAudits.saas.issues
    ];
    memoryIssues = JSON.parse(JSON.stringify(seed)).map(item => ({
      ...item,
      _id: 'mem_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
};

const generateIssueId = async (isMongo) => {
  const prefix = 'A11Y-';
  if (isMongo) {
    const count = await Issue.countDocuments();
    return `${prefix}${100 + count + 1}`;
  } else {
    initializeMemoryStoreIfNeeded();
    return `${prefix}${100 + memoryIssues.length + 1}`;
  }
};

const getAllIssues = async (query = {}) => {
  const dbStatus = getDbStatus();
  const { status, severity, wcagLevel, search, source, assignee, sort = '-createdAt' } = query;

  if (dbStatus.isConnected) {
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (wcagLevel) filter.wcagLevel = wcagLevel;
    if (source) filter.source = source;
    if (assignee) filter['assignedTo.name'] = new RegExp(assignee, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { issueId: new RegExp(search, 'i') },
        { wcagCriterion: new RegExp(search, 'i') },
        { selector: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    let mongoQuery = Issue.find(filter);
    if (sort) {
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.substring(1) : sort;
      mongoQuery = mongoQuery.sort({ [field]: isDesc ? -1 : 1 });
    }
    return await mongoQuery.exec();
  } else {
    initializeMemoryStoreIfNeeded();
    let result = [...memoryIssues];

    if (status) result = result.filter(i => i.status === status);
    if (severity) result = result.filter(i => i.severity === severity);
    if (wcagLevel) result = result.filter(i => i.wcagLevel === wcagLevel);
    if (source) result = result.filter(i => i.source === source);
    if (assignee) {
      const q = assignee.toLowerCase();
      result = result.filter(i => i.assignedTo?.name?.toLowerCase().includes(q));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.issueId?.toLowerCase().includes(q) ||
        i.wcagCriterion?.toLowerCase().includes(q) ||
        i.selector?.toLowerCase().includes(q) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (sort) {
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.substring(1) : sort;
      result.sort((a, b) => {
        let valA = a[field] ?? '';
        let valB = b[field] ?? '';
        if (field === 'createdAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    return result;
  }
};

const getIssueById = async (id) => {
  const dbStatus = getDbStatus();
  if (dbStatus.isConnected) {
    return await Issue.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { issueId: id }] });
  } else {
    initializeMemoryStoreIfNeeded();
    return memoryIssues.find(i => i._id === id || i.issueId === id);
  }
};

const createIssue = async (issueData) => {
  const dbStatus = getDbStatus();
  const nextId = issueData.issueId || await generateIssueId(dbStatus.isConnected);

  const formattedData = {
    ...issueData,
    issueId: nextId,
    history: [
      {
        action: 'created',
        actor: issueData.createdBy || 'Remediation Coordinator',
        timestamp: new Date(),
        details: `Issue ${nextId} created from ${issueData.source || 'manual entry'}`
      }
    ]
  };

  if (dbStatus.isConnected) {
    const issue = new Issue(formattedData);
    return await issue.save();
  } else {
    initializeMemoryStoreIfNeeded();
    const newIssue = {
      ...formattedData,
      _id: 'mem_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryIssues.unshift(newIssue);
    return newIssue;
  }
};

const updateIssue = async (id, updateData) => {
  const dbStatus = getDbStatus();

  if (dbStatus.isConnected) {
    const issue = await getIssueById(id);
    if (!issue) return null;

    Object.assign(issue, updateData);
    issue.history.push({
      action: 'updated',
      actor: updateData.updatedBy || 'Contributor',
      timestamp: new Date(),
      details: 'Issue fields updated'
    });
    return await issue.save();
  } else {
    initializeMemoryStoreIfNeeded();
    const idx = memoryIssues.findIndex(i => i._id === id || i.issueId === id);
    if (idx === -1) return null;

    const current = memoryIssues[idx];
    const updated = {
      ...current,
      ...updateData,
      updatedAt: new Date(),
      history: [
        ...(current.history || []),
        {
          action: 'updated',
          actor: updateData.updatedBy || 'Contributor',
          timestamp: new Date(),
          details: 'Issue fields updated'
        }
      ]
    };
    memoryIssues[idx] = updated;
    return updated;
  }
};

const updateIssueStatus = async (id, status, notes = '', actor = 'Remediation Coordinator') => {
  const dbStatus = getDbStatus();

  if (dbStatus.isConnected) {
    const issue = await getIssueById(id);
    if (!issue) return null;

    const oldStatus = issue.status;
    issue.status = status;
    issue.history.push({
      action: 'status_changed',
      actor,
      timestamp: new Date(),
      details: `Status transitioned from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`
    });

    return await issue.save();
  } else {
    initializeMemoryStoreIfNeeded();
    const idx = memoryIssues.findIndex(i => i._id === id || i.issueId === id);
    if (idx === -1) return null;

    const current = memoryIssues[idx];
    const oldStatus = current.status;
    const updated = {
      ...current,
      status,
      updatedAt: new Date(),
      history: [
        ...(current.history || []),
        {
          action: 'status_changed',
          actor,
          timestamp: new Date(),
          details: `Status transitioned from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`
        }
      ]
    };
    memoryIssues[idx] = updated;
    return updated;
  }
};

const recordVerificationEvidence = async (id, verificationData) => {
  const dbStatus = getDbStatus();
  const {
    verifiedBy = 'A11y Lead',
    assistiveTechUsed = [],
    evidenceNotes = '',
    evidenceImageUrl = '',
    codeDiffConfirmed = false,
    screenReaderTested = false,
    keyboardTested = false,
    status = 'passed', // 'passed' | 'failed' | 'needs_retest'
    targetStatus = 'verified'
  } = verificationData;

  const verificationRecord = {
    status,
    verifiedBy,
    verifiedAt: new Date(),
    assistiveTechUsed,
    evidenceNotes,
    evidenceImageUrl,
    codeDiffConfirmed: Boolean(codeDiffConfirmed),
    screenReaderTested: Boolean(screenReaderTested),
    keyboardTested: Boolean(keyboardTested)
  };

  const newIssueStatus = status === 'passed' ? (targetStatus || 'verified') : 'in_progress';

  if (dbStatus.isConnected) {
    const issue = await getIssueById(id);
    if (!issue) return null;

    issue.verification = verificationRecord;
    issue.status = newIssueStatus;
    issue.history.push({
      action: 'verified',
      actor: verifiedBy,
      timestamp: new Date(),
      details: `Remediation verification [${status.toUpperCase()}]: ${evidenceNotes || 'Verified using assistive tech'}. AT tested: ${assistiveTechUsed.join(', ') || 'N/A'}`
    });

    return await issue.save();
  } else {
    initializeMemoryStoreIfNeeded();
    const idx = memoryIssues.findIndex(i => i._id === id || i.issueId === id);
    if (idx === -1) return null;

    const current = memoryIssues[idx];
    const updated = {
      ...current,
      verification: verificationRecord,
      status: newIssueStatus,
      updatedAt: new Date(),
      history: [
        ...(current.history || []),
        {
          action: 'verified',
          actor: verifiedBy,
          timestamp: new Date(),
          details: `Remediation verification [${status.toUpperCase()}]: ${evidenceNotes || 'Verified using assistive tech'}. AT tested: ${assistiveTechUsed.join(', ') || 'N/A'}`
        }
      ]
    };
    memoryIssues[idx] = updated;
    return updated;
  }
};

const deleteIssue = async (id) => {
  const dbStatus = getDbStatus();
  if (dbStatus.isConnected) {
    return await Issue.findOneAndDelete({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { issueId: id }] });
  } else {
    initializeMemoryStoreIfNeeded();
    const idx = memoryIssues.findIndex(i => i._id === id || i.issueId === id);
    if (idx === -1) return null;
    const deleted = memoryIssues.splice(idx, 1);
    return deleted[0];
  }
};

const importBatch = async (items = [], sourceName = 'imported') => {
  const dbStatus = getDbStatus();
  const created = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const issueId = await generateIssueId(dbStatus.isConnected);
    const doc = {
      ...item,
      issueId: item.issueId || issueId,
      source: item.source || sourceName,
      status: item.status || 'backlog',
      assignedTo: item.assignedTo || { name: 'Unassigned', email: '', role: 'Frontend Engineer' },
      verification: item.verification || {
        status: 'unverified',
        assistiveTechUsed: [],
        evidenceNotes: '',
        codeDiffConfirmed: false,
        screenReaderTested: false,
        keyboardTested: false
      },
      history: [
        {
          action: 'imported',
          actor: 'Report Importer',
          timestamp: new Date(),
          details: `Batch imported from ${sourceName}`
        }
      ]
    };

    if (dbStatus.isConnected) {
      const issue = new Issue(doc);
      created.push(await issue.save());
    } else {
      initializeMemoryStoreIfNeeded();
      const newIssue = {
        ...doc,
        _id: 'mem_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryIssues.unshift(newIssue);
      created.push(newIssue);
    }
  }

  return created;
};

const seedSampleAudit = async (auditKey) => {
  const audit = sampleAudits[auditKey];
  if (!audit) throw new Error(`Unknown sample audit: ${auditKey}`);
  return await importBatch(audit.issues, `sample-${auditKey}`);
};

const resetAndSeedDefaults = async () => {
  const dbStatus = getDbStatus();
  if (dbStatus.isConnected) {
    await Issue.deleteMany({});
  }
  memoryIssues = [];
  initializeMemoryStoreIfNeeded();
  if (dbStatus.isConnected) {
    const seed = [
      ...sampleAudits.ecommerce.issues,
      ...sampleAudits.saas.issues
    ];
    await Issue.insertMany(seed);
  }
  return { success: true, count: memoryIssues.length };
};

const getRemediationStats = async () => {
  const issues = await getAllIssues();

  const total = issues.length;
  const verified = issues.filter(i => i.status === 'verified').length;
  const inProgress = issues.filter(i => i.status === 'in_progress').length;
  const readyForReview = issues.filter(i => i.status === 'ready_for_review').length;
  const todo = issues.filter(i => i.status === 'todo').length;
  const backlog = issues.filter(i => i.status === 'backlog').length;
  const wontFix = issues.filter(i => i.status === 'wont_fix').length;

  const openIssues = total - verified - wontFix;
  const resolutionRate = total > 0 ? Math.round((verified / total) * 100) : 0;

  // Severity breakdown
  const bySeverity = {
    critical: { total: 0, resolved: 0 },
    serious: { total: 0, resolved: 0 },
    moderate: { total: 0, resolved: 0 },
    minor: { total: 0, resolved: 0 }
  };

  // WCAG Level breakdown
  const byLevel = {
    A: { total: 0, resolved: 0 },
    AA: { total: 0, resolved: 0 },
    AAA: { total: 0, resolved: 0 }
  };

  // Assistive tech verification counts
  const atVerificationCounts = {
    'NVDA': 0,
    'JAWS': 0,
    'VoiceOver': 0,
    'Keyboard Only': 0,
    'Color Contrast Analyzer': 0,
    'axe DevTools': 0
  };

  issues.forEach(i => {
    const sev = i.severity || 'moderate';
    if (bySeverity[sev]) {
      bySeverity[sev].total++;
      if (i.status === 'verified') bySeverity[sev].resolved++;
    }

    const lvl = i.wcagLevel || 'AA';
    if (byLevel[lvl]) {
      byLevel[lvl].total++;
      if (i.status === 'verified') byLevel[lvl].resolved++;
    }

    if (i.verification?.assistiveTechUsed) {
      i.verification.assistiveTechUsed.forEach(at => {
        if (atVerificationCounts[at] !== undefined) {
          atVerificationCounts[at]++;
        } else {
          atVerificationCounts[at] = 1;
        }
      });
    }
  });

  // Calculate Accessibility Health & Compliance Score (0-100)
  // Weighted by severity: Critical = 10pts, Serious = 6pts, Moderate = 3pts, Minor = 1pt
  const severityWeights = { critical: 10, serious: 6, moderate: 3, minor: 1 };
  let maxWeight = 0;
  let earnedWeight = 0;

  issues.forEach(i => {
    const w = severityWeights[i.severity] || 3;
    maxWeight += w;
    if (i.status === 'verified') {
      earnedWeight += w;
    } else if (i.status === 'ready_for_review') {
      earnedWeight += w * 0.5; // partial credit for fixed & pending verification
    }
  });

  const accessibilityScore = maxWeight > 0 ? Math.round((earnedWeight / maxWeight) * 100) : 100;

  return {
    total,
    openIssues,
    verified,
    inProgress,
    readyForReview,
    todo,
    backlog,
    wontFix,
    resolutionRate,
    accessibilityScore,
    bySeverity,
    byLevel,
    atVerificationCounts,
    dbMode: getDbStatus().database
  };
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  updateIssueStatus,
  recordVerificationEvidence,
  deleteIssue,
  importBatch,
  seedSampleAudit,
  resetAndSeedDefaults,
  getRemediationStats
};
