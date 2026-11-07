import React, { useState, useEffect } from 'react';
import { IssueProvider, useIssues } from './context/IssueContext';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import BoardView from './components/BoardView';
import TableView from './components/TableView';
import AnalyticsView from './components/AnalyticsView';
import IssueModal from './components/IssueModal';
import VerificationModal from './components/VerificationModal';
import ImportModal from './components/ImportModal';
import ExportReportModal from './components/ExportReportModal';
import AccessibilityAnnouncer from './components/AccessibilityAnnouncer';
import { ShieldCheck, Info } from 'lucide-react';

function TrackerContent({ darkMode, setDarkMode }) {
  const { viewMode } = useIssues();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* WCAG 2.4.1 Bypass Blocks - Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        Skip to main content
      </a>

      {/* Screen reader ARIA live region */}
      <AccessibilityAnnouncer />

      {/* Header & Navigation */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Filter bar is displayed for Board and Table views */}
      {viewMode !== 'analytics' && <FilterBar />}

      {/* Main Content Region */}
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {viewMode === 'board' && <BoardView />}
        {viewMode === 'table' && <TableView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </main>

      {/* Modals */}
      <IssueModal />
      <VerificationModal />
      <ImportModal />
      <ExportReportModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Accessibility Remediation Board — WCAG 2.1 Level AA & Section 508 Compliant Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Keyboard Navigable (WCAG 2.1.1)</span>
            <span>•</span>
            <span>Screen Reader Tested (NVDA, JAWS, VoiceOver)</span>
            <span>•</span>
            <span>Visible Focus (WCAG 2.4.7)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <IssueProvider>
      <TrackerContent darkMode={darkMode} setDarkMode={setDarkMode} />
    </IssueProvider>
  );
}
