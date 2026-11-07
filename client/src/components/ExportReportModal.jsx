import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import {
  X,
  FileDown,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function ExportReportModal() {
  const {
    activeModal,
    closeModal,
    issues,
    stats
  } = useIssues();

  const [copied, setCopied] = useState(false);

  if (activeModal !== 'export') return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(issues, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = ['Issue ID', 'Title', 'Severity', 'WCAG Level', 'WCAG Criterion', 'Status', 'Owner', 'Verification Status', 'AT Tested', 'Verified By'];
    const rows = issues.map((i) => [
      `"${i.issueId}"`,
      `"${(i.title || '').replace(/"/g, '""')}"`,
      `"${i.severity}"`,
      `"${i.wcagLevel}"`,
      `"${(i.wcagCriterion || '').replace(/"/g, '""')}"`,
      `"${i.status}"`,
      `"${i.assignedTo?.name || 'Unassigned'}"`,
      `"${i.verification?.status || 'unverified'}"`,
      `"${(i.verification?.assistiveTechUsed || []).join('; ')}"`,
      `"${i.verification?.verifiedBy || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `accessibility-remediation-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeModal();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Accessibility Remediation Status Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit sign-off summary for stakeholders and VPAT pre-assessment
              </p>
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

        {/* Report Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 text-slate-900 dark:text-slate-100">
          
          {/* Executive Summary Block */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Remediation Audit Status
                </span>
                <h3 className="text-lg font-bold">
                  Digital Accessibility Conformance Brief
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Total Violations</span>
                <strong className="text-base">{issues.length}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Verified Closed</span>
                <strong className="text-base text-emerald-600">
                  {issues.filter(i => i.status === 'verified').length}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Resolution Rate</span>
                <strong className="text-base text-blue-600">
                  {stats?.resolutionRate || 0}%
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Benchmark</span>
                <strong className="text-base">WCAG 2.1 AA</strong>
              </div>
            </div>
          </div>

          {/* Findings Table Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Itemized Remediation Inventory ({issues.length})
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Title & Criterion</th>
                    <th className="p-2.5">Severity</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Verification Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {issues.map(i => (
                    <tr key={i._id || i.issueId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-bold text-blue-600">{i.issueId}</td>
                      <td className="p-2.5">
                        <div className="font-medium line-clamp-1">{i.title}</div>
                        <div className="text-[11px] text-slate-500">§ {i.wcagCriterion}</div>
                      </td>
                      <td className="p-2.5 capitalize">{i.severity}</td>
                      <td className="p-2.5 capitalize">{i.status.replace('_', ' ')}</td>
                      <td className="p-2.5">
                        {i.verification && i.verification.status === 'passed' ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {i.verification.assistiveTechUsed?.join(', ') || 'Verified'}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unverified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 no-print">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-sm transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

