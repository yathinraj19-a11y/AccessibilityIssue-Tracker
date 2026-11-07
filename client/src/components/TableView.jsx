import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  ArrowUpDown
} from 'lucide-react';

export default function TableView() {
  const {
    issues,
    updateStatus,
    openEditModal,
    openViewModal,
    openVerifyModal,
    deleteIssue,
    loading
  } = useIssues();

  const [sortField, setSortField] = useState('issueId');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';

    if (sortField === 'owner') {
      valA = a.assignedTo?.name || '';
      valB = b.assignedTo?.name || '';
    }

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        );
      case 'serious':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            Serious
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Moderate
          </span>
        );
      case 'minor':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Info className="w-3 h-3 text-blue-600" />
            Minor
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Verified & Closed</span>;
      case 'ready_for_review':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Ready for Review</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">In Progress</span>;
      case 'todo':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">To Do</span>;
      case 'wont_fix':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Won't Fix</span>;
      case 'backlog':
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">Backlog</span>;
    }
  };

  const handleDelete = async (issue) => {
    if (window.confirm(`Are you sure you want to delete finding ${issue.issueId}?`)) {
      await deleteIssue(issue._id || issue.issueId, issue.issueId);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Table Header toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base text-slate-900 dark:text-white">
              Accessibility Findings Audit Log
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed list of WCAG violations with responsible owners and verification statuses
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Total records: <span className="font-semibold text-slate-900 dark:text-white">{issues.length}</span>
          </div>
        </div>

        {/* Accessible Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse" aria-label="Accessibility issues data table">
            <caption className="sr-only">Detailed list of accessibility findings and their verification status</caption>
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
              <tr>
                <th scope="col" className="py-3 px-4">
                  <button
                    onClick={() => handleSort('issueId')}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none"
                  >
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">
                  <button
                    onClick={() => handleSort('severity')}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none"
                  >
                    <span>Severity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none"
                  >
                    <span>Finding & Criterion</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">
                  <button
                    onClick={() => handleSort('wcagLevel')}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none"
                  >
                    <span>Level</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">
                  <button
                    onClick={() => handleSort('owner')}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none"
                  >
                    <span>Responsible Owner</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none"
                  >
                    <span>Fix Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">Verification Evidence</th>
                <th scope="col" className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No findings match the current filter criteria.
                  </td>
                </tr>
              ) : (
                sortedIssues.map((issue) => (
                  <tr
                    key={issue._id || issue.issueId}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {issue.issueId}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getSeverityBadge(issue.severity)}
                    </td>

                    {/* Title & Selector */}
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <button
                        onClick={() => openViewModal(issue)}
                        className="text-left font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                      >
                        {issue.title}
                      </button>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono text-[11px] truncate max-w-[200px]">
                          {issue.wcagCriterion}
                        </span>
                        {issue.targetUrl && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                            • {issue.targetUrl}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* WCAG Level */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {issue.wcagLevel}
                      </span>
                    </td>

                    {/* Responsible Owner */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-900 dark:text-slate-100 font-medium">
                        {issue.assignedTo?.name || 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {issue.assignedTo?.role || 'Frontend'}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={issue.status}
                        onChange={(e) => {
                          if (e.target.value === 'verified') {
                            openVerifyModal(issue);
                          } else {
                            updateStatus(issue._id || issue.issueId, e.target.value);
                          }
                        }}
                        className="text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 px-2 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500"
                        aria-label={`Change status for ${issue.issueId}`}
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="ready_for_review">Ready for Review</option>
                        <option value="verified">Verified & Closed</option>
                        <option value="wont_fix">Won't Fix</option>
                      </select>
                    </td>

                    {/* Verification Evidence */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {issue.verification && issue.verification.status === 'passed' ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-900">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold">Sign-off Confirmed</span>
                        </div>
                      ) : issue.verification && issue.verification.status === 'needs_retest' ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-900">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Retest Needed</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unverified</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openVerifyModal(issue)}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition"
                          title="Record verification evidence"
                        >
                          Verify
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(issue)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit finding"
                          aria-label={`Edit ${issue.issueId}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(issue)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete finding"
                          aria-label={`Delete ${issue.issueId}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

