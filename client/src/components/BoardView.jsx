import React from 'react';
import { useIssues } from '../context/IssueContext';
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Code2,
  MoreVertical,
  Plus
} from 'lucide-react';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', description: 'Triaged findings awaiting assignment', color: 'border-t-slate-400' },
  { id: 'todo', title: 'To Do', description: 'Assigned for remediation', color: 'border-t-indigo-500' },
  { id: 'in_progress', title: 'In Progress', description: 'Engineer implementing barrier fix', color: 'border-t-blue-500' },
  { id: 'ready_for_review', title: 'Ready for Review', description: 'PR raised, needs QA / A11y verification', color: 'border-t-amber-500' },
  { id: 'verified', title: 'Verified & Closed', description: 'Assistive tech tested & verified passing', color: 'border-t-emerald-500' },
];

export default function BoardView() {
  const {
    issues,
    updateStatus,
    openEditModal,
    openViewModal,
    openVerifyModal,
    openCreateModal,
    loading
  } = useIssues();

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertOctagon className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Critical
          </span>
        );
      case 'serious':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-900">
            <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            Serious
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Moderate
          </span>
        );
      case 'minor':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Minor
          </span>
        );
    }
  };

  const getNextStatus = (currentStatus) => {
    const sequence = ['backlog', 'todo', 'in_progress', 'ready_for_review', 'verified'];
    const idx = sequence.indexOf(currentStatus);
    return idx < sequence.length - 1 ? sequence[idx + 1] : null;
  };

  const getPrevStatus = (currentStatus) => {
    const sequence = ['backlog', 'todo', 'in_progress', 'ready_for_review', 'verified'];
    const idx = sequence.indexOf(currentStatus);
    return idx > 0 ? sequence[idx - 1] : null;
  };

  const handleQuickAdvance = async (e, issue) => {
    e.stopPropagation();
    const next = getNextStatus(issue.status);
    if (next === 'verified') {
      // Prompt verification evidence modal for sign-off!
      openVerifyModal(issue);
    } else if (next) {
      await updateStatus(issue._id || issue.issueId, next);
    }
  };

  const handleQuickBacktrack = async (e, issue) => {
    e.stopPropagation();
    const prev = getPrevStatus(issue.status);
    if (prev) {
      await updateStatus(issue._id || issue.issueId, prev);
    }
  };

  if (loading && issues.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading accessibility findings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      
      {/* Board Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colIssues = issues.filter((i) => i.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col bg-slate-100/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 border-t-4 ${col.color} min-h-[600px]`}
              role="region"
              aria-label={`${col.title} column with ${colIssues.length} findings`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
                      {col.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-700">
                      {colIssues.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={col.description}>
                    {col.description}
                  </p>
                </div>

                {col.id === 'backlog' && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800"
                    title="Add finding to backlog"
                    aria-label="Add finding to backlog"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Cards List */}
              <div className="p-2 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
                {colIssues.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg text-slate-400 text-xs">
                    <span>No findings in {col.title}</span>
                  </div>
                ) : (
                  colIssues.map((issue) => {
                    const next = getNextStatus(issue.status);
                    const prev = getPrevStatus(issue.status);

                    return (
                      <article
                        key={issue._id || issue.issueId}
                        onClick={() => openViewModal(issue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openViewModal(issue);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Finding ${issue.issueId}: ${issue.title}. Severity: ${issue.severity}. WCAG Level: ${issue.wcagLevel}.`}
                        className="group bg-white dark:bg-slate-800/90 rounded-xl p-3.5 shadow-xs hover:shadow-md border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer relative focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      >
                        {/* Top Row: Issue ID, Severity, WCAG Level */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                              {issue.issueId}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {issue.wcagLevel}
                            </span>
                          </div>
                          {getSeverityBadge(issue.severity)}
                        </div>

                        {/* Title */}
                        <h3 className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {issue.title}
                        </h3>

                        {/* WCAG Criterion tag */}
                        <div className="mb-2.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-full">
                            § {issue.wcagCriterion}
                          </span>
                        </div>

                        {/* Target selector preview */}
                        {issue.selector && (
                          <div className="mb-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                            {issue.selector}
                          </div>
                        )}

                        {/* Verification Evidence Tag (Differentiating Feature) */}
                        {issue.verification && issue.verification.status === 'passed' && (
                          <div className="mb-2.5 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="truncate">
                                {issue.verification.assistiveTechUsed?.length > 0
                                  ? `${issue.verification.assistiveTechUsed.slice(0, 2).join(', ')} Verified`
                                  : 'Evidence Verified'}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                              Passed
                            </span>
                          </div>
                        )}

                        {issue.verification && issue.verification.status === 'needs_retest' && (
                          <div className="mb-2.5 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="truncate">Retest Requested by QA</span>
                          </div>
                        )}

                        {/* Assignee & Actions Row */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                          {/* Responsible Owner */}
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0" title={`Owner: ${issue.assignedTo?.name || 'Unassigned'} (${issue.assignedTo?.role || 'Frontend'})`}>
                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200 shrink-0">
                              {issue.assignedTo?.name ? issue.assignedTo.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className="text-[11px] font-medium truncate max-w-[85px]">
                              {issue.assignedTo?.name || 'Unassigned'}
                            </span>
                          </div>

                          {/* Quick Actions (Move & Verify) */}
                          <div className="flex items-center gap-1">
                            {/* Verify Action Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openVerifyModal(issue);
                              }}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-[11px] font-medium text-slate-700 dark:text-slate-200 transition"
                              title="Sign off verification evidence"
                              aria-label={`Record verification evidence for ${issue.issueId}`}
                            >
                              Verify
                            </button>

                            {/* Backtrack status */}
                            {prev && (
                              <button
                                type="button"
                                onClick={(e) => handleQuickBacktrack(e, issue)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                                title={`Move back to ${prev.replace('_', ' ')}`}
                                aria-label={`Move ${issue.issueId} back to ${prev.replace('_', ' ')}`}
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Advance status */}
                            {next && (
                              <button
                                type="button"
                                onClick={(e) => handleQuickAdvance(e, issue)}
                                className="p-1 rounded text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/60"
                                title={`Advance to ${next.replace('_', ' ')}`}
                                aria-label={`Advance ${issue.issueId} to ${next.replace('_', ' ')}`}
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                      </article>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

