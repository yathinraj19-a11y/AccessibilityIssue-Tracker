import React from 'react';
import { useIssues } from '../context/IssueContext';
import { Search, X, Filter, AlertOctagon, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function FilterBar() {
  const { filters, setFilters, issues } = useIssues();

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleSeverityToggle = (sev) => {
    setFilters(prev => ({
      ...prev,
      severity: prev.severity === sev ? 'all' : sev
    }));
  };

  const handleWcagLevelChange = (lvl) => {
    setFilters(prev => ({
      ...prev,
      wcagLevel: prev.wcagLevel === lvl ? 'all' : lvl
    }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      severity: 'all',
      wcagLevel: 'all',
      source: 'all',
      assignee: ''
    });
  };

  const isFiltered = filters.search || filters.status !== 'all' || filters.severity !== 'all' || filters.wcagLevel !== 'all' || filters.source !== 'all' || filters.assignee;

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="search-findings" className="sr-only">
            Search accessibility findings by title, WCAG criterion, or selector
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="search-findings"
            type="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by title, WCAG (e.g. 1.4.3), selector, tag..."
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 transition"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Severity chips */}
          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleSeverityToggle('critical')}
              className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                filters.severity === 'critical'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
              aria-pressed={filters.severity === 'critical'}
            >
              <AlertOctagon className="w-3 h-3" />
              <span>Critical</span>
            </button>
            <button
              type="button"
              onClick={() => handleSeverityToggle('serious')}
              className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                filters.severity === 'serious'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
              aria-pressed={filters.severity === 'serious'}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Serious</span>
            </button>
            <button
              type="button"
              onClick={() => handleSeverityToggle('moderate')}
              className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                filters.severity === 'moderate'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/40'
              }`}
              aria-pressed={filters.severity === 'moderate'}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Moderate</span>
            </button>
            <button
              type="button"
              onClick={() => handleSeverityToggle('minor')}
              className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                filters.severity === 'minor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
              aria-pressed={filters.severity === 'minor'}
            >
              <Info className="w-3 h-3" />
              <span>Minor</span>
            </button>
          </div>

          {/* WCAG Level selector */}
          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1.5">WCAG:</span>
            {['A', 'AA', 'AAA'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleWcagLevelChange(lvl)}
                className={`px-2 py-1 rounded text-xs font-semibold transition ${
                  filters.wcagLevel === lvl
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
                aria-pressed={filters.wcagLevel === lvl}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="relative">
            <label htmlFor="status-filter-select" className="sr-only">Filter by Status</label>
            <select
              id="status-filter-select"
              value={filters.status}
              onChange={handleStatusChange}
              className="py-1.5 pl-2.5 pr-8 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900"
            >
              <option value="all">All Statuses</option>
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="ready_for_review">Ready for Review</option>
              <option value="verified">Verified & Closed</option>
              <option value="wont_fix">Won't Fix</option>
            </select>
          </div>

          {/* Reset Filters CTA if any filter active */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset filters
            </button>
          )}

          {/* Count pill */}
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-auto sm:ml-0">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{issues.length}</span> findings
          </div>

        </div>

      </div>
    </div>
  );
}

