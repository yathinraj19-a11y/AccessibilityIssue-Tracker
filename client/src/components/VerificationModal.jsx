import React, { useState, useEffect } from 'react';
import { useIssues } from '../context/IssueContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Monitor,
  Keyboard,
  Glasses,
  FileCheck,
  UploadCloud
} from 'lucide-react';

const AT_OPTIONS = [
  { id: 'NVDA', label: 'NVDA (Windows Screen Reader)' },
  { id: 'VoiceOver', label: 'VoiceOver (macOS / iOS)' },
  { id: 'JAWS', label: 'JAWS (Windows Enterprise)' },
  { id: 'TalkBack', label: 'TalkBack (Android)' },
  { id: 'Keyboard Only', label: 'Keyboard-Only Traversal (Tab / Esc / Arrows)' },
  { id: 'Color Contrast Analyzer', label: 'Color Contrast Analyzer (CCA v3)' },
  { id: 'axe DevTools', label: 'axe DevTools Automated Engine' }
];

export default function VerificationModal() {
  const {
    activeModal,
    selectedIssue,
    closeModal,
    submitVerification
  } = useIssues();

  const [verifiedBy, setVerifiedBy] = useState('Morgan Davis');
  const [verifierRole, setVerifierRole] = useState('QA Accessibility Lead (CPACC)');
  const [outcomeStatus, setOutcomeStatus] = useState('passed'); // 'passed' | 'failed' | 'needs_retest'
  const [selectedAT, setSelectedAT] = useState(['Keyboard Only', 'NVDA']);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [evidenceImageUrl, setEvidenceImageUrl] = useState('');
  const [codeDiffConfirmed, setCodeDiffConfirmed] = useState(true);
  const [screenReaderTested, setScreenReaderTested] = useState(true);
  const [keyboardTested, setKeyboardTested] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedIssue?.verification) {
      const v = selectedIssue.verification;
      if (v.verifiedBy) setVerifiedBy(v.verifiedBy);
      if (v.status) setOutcomeStatus(v.status);
      if (v.assistiveTechUsed?.length) setSelectedAT(v.assistiveTechUsed);
      if (v.evidenceNotes) setEvidenceNotes(v.evidenceNotes);
      if (v.evidenceImageUrl) setEvidenceImageUrl(v.evidenceImageUrl);
      setCodeDiffConfirmed(Boolean(v.codeDiffConfirmed));
      setScreenReaderTested(Boolean(v.screenReaderTested));
      setKeyboardTested(Boolean(v.keyboardTested));
    } else {
      setEvidenceNotes('Tested on Chrome 124 with NVDA. Verified accessible name announcement, focus ring visibility, and tab traversal order.');
    }
  }, [selectedIssue]);

  if (activeModal !== 'verify' || !selectedIssue) return null;

  const handleToggleAT = (id) => {
    setSelectedAT((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!verifiedBy.trim()) {
      setErrorMsg('Verifier name is required.');
      return;
    }
    if (!evidenceNotes.trim() || evidenceNotes.trim().length < 5) {
      setErrorMsg('Please provide detailed verification notes (at least 5 characters).');
      return;
    }

    try {
      setSubmitting(true);
      await submitVerification(selectedIssue._id || selectedIssue.issueId, {
        verifiedBy: `${verifiedBy.trim()} (${verifierRole})`,
        status: outcomeStatus,
        assistiveTechUsed: selectedAT,
        evidenceNotes: evidenceNotes.trim(),
        evidenceImageUrl: evidenceImageUrl.trim(),
        codeDiffConfirmed,
        screenReaderTested,
        keyboardTested,
        targetStatus: outcomeStatus === 'passed' ? 'verified' : outcomeStatus === 'failed' ? 'in_progress' : 'ready_for_review'
      });
      closeModal();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit verification evidence');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeModal();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-50/60 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {selectedIssue.issueId}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Audit Sign-Off
                </span>
              </div>
              <h2 id="verify-modal-title" className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Record Verification Evidence
              </h2>
            </div>
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

        {/* Form Body */}
        <form id="verify-form" onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Finding summary card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white">
              {selectedIssue.title}
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              § {selectedIssue.wcagCriterion} (Level {selectedIssue.wcagLevel}) • Target: {selectedIssue.selector || selectedIssue.targetUrl || 'DOM element'}
            </div>
          </div>

          {/* Verification Outcome Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Verification Outcome <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOutcomeStatus('passed')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  outcomeStatus === 'passed'
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passed</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Barrier completely resolved & verified in AT
                </p>
              </button>

              <button
                type="button"
                onClick={() => setOutcomeStatus('failed')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  outcomeStatus === 'failed'
                    ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 ring-2 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs">
                  <XCircle className="w-4 h-4" />
                  <span>Failed</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Barrier persists; sends back to In Progress
                </p>
              </button>

              <button
                type="button"
                onClick={() => setOutcomeStatus('needs_retest')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  outcomeStatus === 'needs_retest'
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 ring-2 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Needs Retest</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Edge case or partial regression noted
                </p>
              </button>
            </div>
          </div>

          {/* Assistive Technologies Used */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Assistive Modalities & Tools Tested
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AT_OPTIONS.map((tool) => {
                const isChecked = selectedAT.includes(tool.id);
                return (
                  <label
                    key={tool.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleAT(tool.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{tool.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Verifier Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="verifier-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Verifier Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="verifier-name"
                type="text"
                required
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                placeholder="e.g. Morgan Davis"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="verifier-role" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Verifier Credential / Role
              </label>
              <input
                id="verifier-role"
                type="text"
                value={verifierRole}
                onChange={(e) => setVerifierRole(e.target.value)}
                placeholder="QA Accessibility Lead (CPACC)"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Evidence Notes */}
          <div>
            <label htmlFor="evidence-notes" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Retest Steps & Assistive Tech Evidence Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="evidence-notes"
              required
              rows={3}
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
              placeholder="e.g. Focused button via Tab key. NVDA 2024 announced 'Place your order, button'. Pressed Space to trigger successfully. Color contrast verified at 5.4:1."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Test Screenshot / Evidence Artifact URL */}
          <div>
            <label htmlFor="evidence-image-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Evidence Screenshot / Test Artifact URL (Optional)
            </label>
            <input
              id="evidence-image-url"
              type="url"
              value={evidenceImageUrl}
              onChange={(e) => setEvidenceImageUrl(e.target.value)}
              placeholder="https://artifacts.company.net/a11y/audit-screenshot-482.png"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Verification Affirmation Checkboxes */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Audit Compliance Affirmations
            </span>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={codeDiffConfirmed}
                onChange={(e) => setCodeDiffConfirmed(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Code diff confirmed in pull request or staging deployment</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={screenReaderTested}
                onChange={(e) => setScreenReaderTested(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Live screen reader speech output verified (speech buffer and virtual cursor)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={keyboardTested}
                onChange={(e) => setKeyboardTested(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Keyboard-only interaction tested (visible focus ring, no keyboard trap)</span>
            </label>
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="verify-form"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium shadow-sm transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{submitting ? 'Signing off...' : 'Sign Off & Update Status'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

