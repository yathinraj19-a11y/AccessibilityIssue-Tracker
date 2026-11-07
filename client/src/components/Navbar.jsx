import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import {
  LayoutDashboard,
  Table as TableIcon,
  BarChart3,
  PlusCircle,
  UploadCloud,
  FileDown,
  RotateCcw,
  Moon,
  Sun,
  ShieldCheck,
  Keyboard,
  Info
} from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const {
    viewMode,
    setViewMode,
    openCreateModal,
    openImportModal,
    openExportModal,
    resetDemoBoard,
    stats,
    issues
  } = useIssues();

  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset board to default sample accessibility audits? Any custom findings will be replaced with fresh benchmark issues.')) {
      await resetDemoBoard();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                {/* Custom accessible icon: Universal accessibility mark */}
                <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="4" r="2" />
                  <path d="m4.93 10.93 4.24-4.24a5 5 0 0 1 7.07 0l4.24 4.24" />
                  <path d="m14 13 3 7" />
                  <path d="m10 13-3 7" />
                  <path d="M8 10h8" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                    AccessibilityIssue Tracker
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Remediation Board
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Assign, fix, and verify WCAG 2.1 compliance with evidence
                </p>
              </div>
            </div>

            {/* View Switcher Tabs (Board, Table, Analytics) */}
            <nav className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700" aria-label="Views">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-current={viewMode === 'board' ? 'page' : undefined}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Board</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-current={viewMode === 'table' ? 'page' : undefined}
              >
                <TableIcon className="w-4 h-4" />
                <span>List ({issues.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('analytics')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'analytics'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-current={viewMode === 'analytics' ? 'page' : undefined}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Scorecard</span>
                {stats && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    stats.accessibilityScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    stats.accessibilityScore >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {stats.accessibilityScore}%
                  </span>
                )}
              </button>
            </nav>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-2">
              
              {/* Import findings modal trigger */}
              <button
                type="button"
                onClick={openImportModal}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                title="Import findings from axe-core, Lighthouse, or sample audit report"
              >
                <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Import Findings</span>
              </button>

              {/* Export report */}
              <button
                type="button"
                onClick={openExportModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                title="Export remediation audit report for VPAT"
              >
                <FileDown className="w-4 h-4 text-slate-500" />
                <span>Export Report</span>
              </button>

              {/* New Finding CTA */}
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">New Finding</span>
              </button>

              {/* Reset Demo button */}
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition"
                title="Reset board to sample audits"
                aria-label="Reset board to sample audits"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Keyboard shortcuts modal trigger */}
              <button
                type="button"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition"
                title="Keyboard accessibility helper"
                aria-label="View keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              {/* Dark mode toggle */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition"
                aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Dialog */}
      {showShortcuts && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 id="shortcuts-title" className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                Accessibility & Keyboard Controls
              </h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
                aria-label="Close keyboard shortcuts dialog"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Tab / Shift + Tab</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Navigate interactive elements</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Space / Enter</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Trigger button / open card</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Escape</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Close active modal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Accessible Status Steps</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Select dropdown or buttons</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Screen Reader Support</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">NVDA, JAWS, VoiceOver verified</span>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

