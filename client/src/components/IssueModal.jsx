import React, { useState, useEffect } from 'react';
import { useIssues } from '../context/IssueContext';
import {
  X,
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  Code2,
  ExternalLink,
  History,
  CheckCircle2,
  Clock
} from 'lucide-react';

const COMMON_WCAG_CRITERIA = [
  '1.1.1 Non-text Content (Level A)',
  '1.3.1 Info and Relationships (Level A)',
  '1.4.1 Use of Color (Level A)',
  '1.4.3 Contrast (Minimum) (Level AA)',
  '1.4.11 Non-text Contrast (Level AA)',
  '2.1.1 Keyboard (Level A)',
  '2.1.2 No Keyboard Trap (Level A)',
  '2.4.1 Bypass Blocks (Level A)',
  '2.4.3 Focus Order (Level A)',
  '2.4.7 Focus Visible (Level AA)',
  '3.3.1 Error Identification (Level A)',
  '3.3.2 Labels or Instructions (Level A)',
  '4.1.2 Name, Role, Value (Level A)',
  '4.1.3 Status Messages (Level AA)'
];

export default function IssueModal() {
  const {
    activeModal,
    selectedIssue,
    modalMode,
    closeModal,
    createIssue,
    updateIssue,
    openVerifyModal
  } = useIssues();

  const isView = modalMode === 'view';
  const isEdit = modalMode === 'edit';
  const isCreate = modalMode === 'create';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wcagCriterion: '4.1.2 Name, Role, Value',
    wcagLevel: 'AA',
    severity: 'serious',
    targetUrl: '',
    selector: '',
    htmlSnippet: '',
    status: 'backlog',
    assignedTo: {
      name: '',
      email: '',
      role: 'Frontend Engineer'
    },
    remediation: {
      suggestedFix: '',
      fixSnippet: '',
      pullRequestUrl: ''
    },
    tagsString: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedIssue) {
      setFormData({
        title: selectedIssue.title || '',
        description: selectedIssue.description || '',
        wcagCriterion: selectedIssue.wcagCriterion || '4.1.2 Name, Role, Value',
        wcagLevel: selectedIssue.wcagLevel || 'AA',
        severity: selectedIssue.severity || 'serious',
        targetUrl: selectedIssue.targetUrl || '',
        selector: selectedIssue.selector || '',
        htmlSnippet: selectedIssue.htmlSnippet || '',
        status: selectedIssue.status || 'backlog',
        assignedTo: {
          name: selectedIssue.assignedTo?.name || '',
          email: selectedIssue.assignedTo?.email || '',
          role: selectedIssue.assignedTo?.role || 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: selectedIssue.remediation?.suggestedFix || '',
          fixSnippet: selectedIssue.remediation?.fixSnippet || '',
          pullRequestUrl: selectedIssue.remediation?.pullRequestUrl || ''
        },
        tagsString: selectedIssue.tags ? selectedIssue.tags.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        wcagCriterion: '4.1.2 Name, Role, Value',
        wcagLevel: 'AA',
        severity: 'serious',
        targetUrl: '',
        selector: '',
        htmlSnippet: '',
        status: 'backlog',
        assignedTo: {
          name: 'Sarah Chen',
          email: 'sarah.chen@engineering.local',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: '',
          fixSnippet: '',
          pullRequestUrl: ''
        },
        tagsString: 'aria, button'
      });
    }
  }, [selectedIssue, modalMode]);

  if (activeModal !== 'issue') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Finding Title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Description is required.');
      return;
    }
    if (!formData.wcagCriterion.trim()) {
      setErrorMsg('WCAG Criterion is required.');
      return;
    }

    const tags = formData.tagsString
      ? formData.tagsString.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      tags
    };

    try {
      setSubmitting(true);
      if (isCreate) {
        await createIssue(payload);
      } else if (isEdit && selectedIssue) {
        await updateIssue(selectedIssue._id || selectedIssue.issueId, payload);
      }
      closeModal();
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeModal();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {selectedIssue ? selectedIssue.issueId : 'New Finding'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                {isCreate ? 'Manual Audit Import' : isEdit ? 'Edit Finding' : 'Audit Details'}
              </span>
            </div>
            <h2 id="issue-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
              {isCreate ? 'Register New Accessibility Barrier' : formData.title || selectedIssue?.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {isView && selectedIssue ? (
            /* Detailed View Mode */
            <div className="space-y-6">
              {/* Overview grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Severity</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                    {selectedIssue.severity}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">WCAG Level</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Level {selectedIssue.wcagLevel}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Fix Status</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                    {selectedIssue.status.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Owner</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {selectedIssue.assignedTo?.name || 'Unassigned'}
                  </div>
                </div>
              </div>

              {/* Criterion & Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  WCAG Criterion & Barrier
                </h4>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mb-2">
                  § {selectedIssue.wcagCriterion}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedIssue.description}
                </p>
              </div>

              {/* DOM Selector & Offending Snippet */}
              {(selectedIssue.selector || selectedIssue.htmlSnippet) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    DOM Target & Offending Code
                  </h4>
                  {selectedIssue.selector && (
                    <div className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      Selector: {selectedIssue.selector}
                    </div>
                  )}
                  {selectedIssue.htmlSnippet && (
                    <pre className="p-3 rounded-lg bg-slate-950 text-rose-300 text-xs font-mono overflow-x-auto">
                      <code>{selectedIssue.htmlSnippet}</code>
                    </pre>
                  )}
                </div>
              )}

              {/* Remediation & Suggested Fix */}
              {selectedIssue.remediation && (
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" /> Remediation Guidance & Fix
                  </h4>
                  {selectedIssue.remediation.suggestedFix && (
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {selectedIssue.remediation.suggestedFix}
                    </p>
                  )}
                  {selectedIssue.remediation.fixSnippet && (
                    <pre className="p-3 rounded-lg bg-slate-950 text-emerald-300 text-xs font-mono overflow-x-auto">
                      <code>{selectedIssue.remediation.fixSnippet}</code>
                    </pre>
                  )}
                  {selectedIssue.remediation.pullRequestUrl && (
                    <a
                      href={selectedIssue.remediation.pullRequestUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                    >
                      <span>Pull Request / Commit Evidence</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Verification Evidence Suite (Differentiating Feature) */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verification Evidence Suite
                  </h4>
                  <button
                    type="button"
                    onClick={() => openVerifyModal(selectedIssue)}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition"
                  >
                    Update Verification Evidence
                  </button>
                </div>

                {selectedIssue.verification && selectedIssue.verification.verifiedBy ? (
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <span className="text-slate-400 font-semibold">Verifier: </span>
                        <strong>{selectedIssue.verification.verifiedBy}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Outcome: </span>
                        <span className="font-bold text-emerald-600 uppercase">
                          {selectedIssue.verification.status}
                        </span>
                      </div>
                      {selectedIssue.verification.verifiedAt && (
                        <div>
                          <span className="text-slate-400 font-semibold">Date: </span>
                          <span>{new Date(selectedIssue.verification.verifiedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {selectedIssue.verification.assistiveTechUsed?.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-slate-400 font-semibold">AT Tested: </span>
                        {selectedIssue.verification.assistiveTechUsed.map((at) => (
                          <span key={at} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-medium text-[11px]">
                            {at}
                          </span>
                        ))}
                      </div>
                    )}

                    {selectedIssue.verification.evidenceNotes && (
                      <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900">
                        <span className="text-slate-400 font-semibold block mb-1">Retest Evidence Notes:</span>
                        <p className="bg-white dark:bg-slate-900 p-2.5 rounded border border-emerald-200 dark:border-emerald-800 italic">
                          "{selectedIssue.verification.evidenceNotes}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No verification sign-off submitted yet. Once the engineer implements a fix, record screen reader and keyboard test notes here.
                  </p>
                )}
              </div>

              {/* History Audit Trail */}
              {selectedIssue.history && selectedIssue.history.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Remediation Audit Trail
                  </h4>
                  <div className="space-y-1.5">
                    {selectedIssue.history.map((hist, idx) => (
                      <div key={idx} className="text-xs p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between">
                        <span>{hist.details || hist.action}</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Create / Edit Form */
            <form id="issue-form" onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title */}
              <div>
                <label htmlFor="issue-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Finding Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="issue-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Primary 'Place Order' button missing accessible name"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Severity & WCAG Level & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="issue-severity" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Severity <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="issue-severity"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="critical">Critical (Blocks users)</option>
                    <option value="serious">Serious (High impact)</option>
                    <option value="moderate">Moderate (Noticeable barrier)</option>
                    <option value="minor">Minor (Low severity)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="issue-wcag-level" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    WCAG Level
                  </label>
                  <select
                    id="issue-wcag-level"
                    value={formData.wcagLevel}
                    onChange={(e) => setFormData({ ...formData, wcagLevel: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="A">Level A (Minimum)</option>
                    <option value="AA">Level AA (Legal Benchmark)</option>
                    <option value="AAA">Level AAA (Enhanced)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="issue-status" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Fix Status
                  </label>
                  <select
                    id="issue-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="ready_for_review">Ready for Review</option>
                    <option value="verified">Verified & Closed</option>
                    <option value="wont_fix">Won't Fix</option>
                  </select>
                </div>
              </div>

              {/* WCAG Criterion Preset & Input */}
              <div>
                <label htmlFor="issue-wcag-criterion" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  WCAG Criterion <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="issue-wcag-criterion"
                    type="text"
                    required
                    value={formData.wcagCriterion}
                    onChange={(e) => setFormData({ ...formData, wcagCriterion: e.target.value })}
                    placeholder="e.g. 1.4.3 Contrast (Minimum)"
                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setFormData({ ...formData, wcagCriterion: e.target.value });
                    }}
                    className="px-2 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 max-w-[140px]"
                    aria-label="Common WCAG presets"
                  >
                    <option value="">Presets...</option>
                    {COMMON_WCAG_CRITERIA.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="issue-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Barrier Description & User Impact <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="issue-desc"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain how the barrier manifests for assistive technology or keyboard users..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Target URL & Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="issue-target-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Target URL / Route
                  </label>
                  <input
                    id="issue-target-url"
                    type="text"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    placeholder="/checkout/payment"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="issue-selector" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    CSS Selector
                  </label>
                  <input
                    id="issue-selector"
                    type="text"
                    value={formData.selector}
                    onChange={(e) => setFormData({ ...formData, selector: e.target.value })}
                    placeholder="button#checkout-pay-btn"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Offending HTML snippet */}
              <div>
                <label htmlFor="issue-html" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Offending HTML Snippet
                </label>
                <textarea
                  id="issue-html"
                  rows={2}
                  value={formData.htmlSnippet}
                  onChange={(e) => setFormData({ ...formData, htmlSnippet: e.target.value })}
                  placeholder='<button class="btn-pay"><svg>...</svg></button>'
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Responsible Owner */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Responsible Owner Assignment
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="owner-name" className="block text-[11px] font-semibold text-slate-500 mb-1">Owner Name</label>
                    <input
                      id="owner-name"
                      type="text"
                      value={formData.assignedTo.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        assignedTo: { ...formData.assignedTo, name: e.target.value }
                      })}
                      placeholder="Sarah Chen"
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="owner-email" className="block text-[11px] font-semibold text-slate-500 mb-1">Owner Email</label>
                    <input
                      id="owner-email"
                      type="email"
                      value={formData.assignedTo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        assignedTo: { ...formData.assignedTo, email: e.target.value }
                      })}
                      placeholder="sarah@corp.local"
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="owner-role" className="block text-[11px] font-semibold text-slate-500 mb-1">Role</label>
                    <select
                      id="owner-role"
                      value={formData.assignedTo.role}
                      onChange={(e) => setFormData({
                        ...formData,
                        assignedTo: { ...formData.assignedTo, role: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    >
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="QA A11y Specialist">QA A11y Specialist</option>
                      <option value="Fullstack Dev">Fullstack Dev</option>
                      <option value="Content Author">Content Author</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Remediation Fix */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Remediation Details (Optional)
                </span>
                <div>
                  <label htmlFor="suggested-fix" className="block text-[11px] font-semibold text-slate-500 mb-1">Remediation Guidance</label>
                  <input
                    id="suggested-fix"
                    type="text"
                    value={formData.remediation.suggestedFix}
                    onChange={(e) => setFormData({
                      ...formData,
                      remediation: { ...formData.remediation, suggestedFix: e.target.value }
                    })}
                    placeholder="Add aria-label and accessible text..."
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label htmlFor="fix-snippet" className="block text-[11px] font-semibold text-slate-500 mb-1">Fixed Code Snippet</label>
                  <textarea
                    id="fix-snippet"
                    rows={2}
                    value={formData.remediation.fixSnippet}
                    onChange={(e) => setFormData({
                      ...formData,
                      remediation: { ...formData.remediation, fixSnippet: e.target.value }
                    })}
                    placeholder='<button aria-label="Place Order">...'
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="issue-tags" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  id="issue-tags"
                  type="text"
                  value={formData.tagsString}
                  onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                  placeholder="contrast, checkout, forms, keyboard"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isView ? 'Close' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            {isView && selectedIssue && (
              <button
                type="button"
                onClick={() => openVerifyModal(selectedIssue)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition"
              >
                Sign Off Verification Evidence
              </button>
            )}

            {!isView && (
              <button
                type="submit"
                form="issue-form"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium transition"
              >
                {submitting ? 'Saving...' : isCreate ? 'Register Finding' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

