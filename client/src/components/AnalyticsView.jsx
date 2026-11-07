import React from 'react';
import { useIssues } from '../context/IssueContext';
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Monitor,
  Eye,
  Glasses
} from 'lucide-react';

export default function AnalyticsView() {
  const { stats, issues } = useIssues();

  if (!stats) {
    return (
      <div className="py-12 text-center text-slate-500">
        Loading analytics metrics...
      </div>
    );
  }

  const {
    total = 0,
    openIssues = 0,
    verified = 0,
    inProgress = 0,
    readyForReview = 0,
    todo = 0,
    backlog = 0,
    resolutionRate = 0,
    accessibilityScore = 0,
    bySeverity = {},
    byLevel = {},
    atVerificationCounts = {}
  } = stats;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner / Executive Summary */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-blue-100 backdrop-blur mb-2 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>VPAT / WCAG 2.1 Remediation Health</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Remediation Velocity & Compliance Scorecard
            </h2>
            <p className="text-sm text-blue-100 max-w-2xl mt-1">
              Live tracking of accessibility debt, barrier resolution rates, and assistive technology verification rigor across your digital products.
            </p>
          </div>

          {/* Large Score Radial/Badge */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-black text-white">
                {accessibilityScore}<span className="text-lg font-normal text-blue-200">/100</span>
              </div>
              <div className="text-[11px] font-medium text-blue-200 uppercase tracking-wider">
                A11y Health Score
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-300">
                {resolutionRate}%
              </div>
              <div className="text-[11px] font-medium text-blue-200 uppercase tracking-wider">
                Resolution Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Findings</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{total}</div>
          <div className="text-xs text-slate-400 mt-1">Imported from audits</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400">Open Remediations</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{openIssues}</div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">{inProgress} currently in progress</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Awaiting Sign-off</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{readyForReview}</div>
          <div className="text-xs text-blue-500 mt-1">Ready for QA verification</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Verified & Closed</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{verified}</div>
          <div className="text-xs text-emerald-600 mt-1">Assistive tech signed off</div>
        </div>
      </div>

      {/* Two Column Section: Severity & WCAG Level Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Severity Remediation Progress */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Findings by Severity</span>
            <span className="text-xs font-normal text-slate-500">Resolved vs Total</span>
          </h3>

          <div className="space-y-4">
            {/* Critical */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Critical
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {bySeverity.critical?.resolved || 0} / {bySeverity.critical?.total || 0} closed
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-600 h-full rounded-full transition-all"
                  style={{
                    width: `${bySeverity.critical?.total ? (bySeverity.critical.resolved / bySeverity.critical.total) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Serious */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Serious
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {bySeverity.serious?.resolved || 0} / {bySeverity.serious?.total || 0} closed
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all"
                  style={{
                    width: `${bySeverity.serious?.total ? (bySeverity.serious.resolved / bySeverity.serious.total) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Moderate */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Moderate
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {bySeverity.moderate?.resolved || 0} / {bySeverity.moderate?.total || 0} closed
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{
                    width: `${bySeverity.moderate?.total ? (bySeverity.moderate.resolved / bySeverity.moderate.total) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Minor */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Minor
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {bySeverity.minor?.resolved || 0} / {bySeverity.minor?.total || 0} closed
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{
                    width: `${bySeverity.minor?.total ? (bySeverity.minor.resolved / bySeverity.minor.total) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* WCAG Conformance Levels */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>WCAG 2.1 Conformance Level Breakdown</span>
            <span className="text-xs font-normal text-slate-500">Compliance tiers</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {['A', 'AA', 'AAA'].map((lvl) => {
              const data = byLevel[lvl] || { total: 0, resolved: 0 };
              const percent = data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 100;
              return (
                <div key={lvl} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                    Level {lvl}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white my-1">
                    {percent}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {data.resolved} / {data.total} resolved
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-200">
            <strong>Standard Note:</strong> WCAG Level AA is the worldwide legal benchmark for Section 508, European EN 301 549, and ADA Title III compliance. Level A barriers block access entirely.
          </div>
        </div>

      </div>

      {/* Assistive Technology Testing Coverage (Differentiating Feature) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Assistive Technology & Verification Evidence Coverage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit sign-offs require multi-modality verification with real screen readers, keyboard testing, and contrast analyzers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(atVerificationCounts).map(([tool, count]) => (
            <div key={tool} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate" title={tool}>
                {tool}
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 my-1">
                {count}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">
                Verifications
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

