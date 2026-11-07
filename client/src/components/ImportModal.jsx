import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  ShoppingBag,
  Cloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ImportModal() {
  const {
    activeModal,
    closeModal,
    seedSampleAudit,
    importFindings
  } = useIssues();

  const [activeTab, setActiveTab] = useState('samples'); // 'samples' | 'axe' | 'json'
  const [rawJson, setRawJson] = useState('');
  const [sourceName, setSourceName] = useState('axe-core-audit');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  if (activeModal !== 'import') return null;

  const handleSeedSample = async (auditKey) => {
    try {
      setLoading(true);
      setStatusMsg({ text: '', type: '' });
      await seedSampleAudit(auditKey);
      setStatusMsg({
        text: `Successfully imported findings from ${auditKey} sample audit!`,
        type: 'success'
      });
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      setStatusMsg({ text: err.message || 'Import failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomImport = async () => {
    setStatusMsg({ text: '', type: '' });
    if (!rawJson.trim()) {
      setStatusMsg({ text: 'Please paste JSON content to import.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const parsed = JSON.parse(rawJson);
      let findingsToImport = [];

      // Check if it's an axe-core export format: { violations: [...] }
      if (parsed.violations && Array.isArray(parsed.violations)) {
        findingsToImport = parsed.violations.map((v, idx) => ({
          title: v.help || v.description || v.id,
          description: v.description || v.help,
          wcagCriterion: (v.tags && v.tags.find(t => t.startsWith('wcag'))) ? v.tags.find(t => t.startsWith('wcag')).replace('wcag', 'WCAG ') : '4.1.2 Name, Role, Value',
          wcagLevel: v.tags?.includes('wcag2aa') ? 'AA' : v.tags?.includes('wcag2aaa') ? 'AAA' : 'A',
          severity: v.impact === 'critical' ? 'critical' : v.impact === 'serious' ? 'serious' : v.impact === 'minor' ? 'minor' : 'moderate',
          selector: v.nodes?.[0]?.target?.[0] || '',
          htmlSnippet: v.nodes?.[0]?.html || '',
          targetUrl: parsed.url || '/sample-page',
          source: 'axe-core',
          assignedTo: { name: 'Sarah Chen', email: '', role: 'Frontend Engineer' },
          remediation: { suggestedFix: v.helpUrl ? `Review axe-core guidance at ${v.helpUrl}` : '' }
        }));
      }
      // Check if it's an array directly
      else if (Array.isArray(parsed)) {
        findingsToImport = parsed.map(item => ({
          title: item.title || item.name || 'Imported Finding',
          description: item.description || 'Imported accessibility issue',
          wcagCriterion: item.wcagCriterion || '1.4.3 Contrast (Minimum)',
          wcagLevel: item.wcagLevel || 'AA',
          severity: item.severity || 'serious',
          selector: item.selector || '',
          htmlSnippet: item.htmlSnippet || '',
          targetUrl: item.targetUrl || '/',
          source: sourceName || 'custom-import'
        }));
      }
      // Check if single issue object
      else if (typeof parsed === 'object' && parsed.title) {
        findingsToImport = [parsed];
      } else {
        throw new Error('Unrecognized JSON format. Expected an array of findings or an axe-core { violations: [...] } payload.');
      }

      await importFindings(findingsToImport, sourceName);
      setStatusMsg({
        text: `Successfully imported ${findingsToImport.length} findings!`,
        type: 'success'
      });
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      setStatusMsg({
        text: `Import error: ${err.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeModal();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 id="import-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Import Accessibility Findings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Load real-world sample audit reports or import axe-core/Lighthouse JSON
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

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 bg-slate-50/30 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'samples'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Preloaded Sample Audits</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('axe')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'axe'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>axe-core / Lighthouse JSON</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {statusMsg.text && (
            <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {activeTab === 'samples' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Choose a pre-packaged, professionally documented accessibility audit report to populate the board with realistic barriers, code snippets, and remediation guides.
              </p>

              {/* Sample 1: E-Commerce */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-500/50 transition space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                        RetailCore E-Commerce Checkout Audit
                      </h3>
                      <p className="text-xs text-slate-500">
                        8 findings • WCAG 2.1 Level AA • Target: Checkout flow & Product Grid
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSeedSample('ecommerce')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium transition shrink-0"
                  >
                    Import Audit
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2">
                  <span className="font-medium text-slate-500">Includes:</span>
                  <span>Missing button accessible names</span>
                  <span>• Color contrast failures</span>
                  <span>• Modal focus trap</span>
                  <span>• Swatch alt text</span>
                </div>
              </div>

              {/* Sample 2: SaaS Portal */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-500/50 transition space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                        CloudPulse Analytics SaaS Portal Audit
                      </h3>
                      <p className="text-xs text-slate-500">
                        6 findings • WCAG 2.1 AA / Section 508 • Target: Metrics & Tables
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSeedSample('saas')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium transition shrink-0"
                  >
                    Import Audit
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2">
                  <span className="font-medium text-slate-500">Includes:</span>
                  <span>Canvas chart data alternatives</span>
                  <span>• Table headers & sorting</span>
                  <span>• Bypass skip links</span>
                  <span>• Toast aria-live</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="source-name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Report Source Label
                </label>
                <input
                  id="source-name-input"
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="axe-core-production-run"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label htmlFor="raw-json-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Raw axe-core or Lighthouse JSON Export
                </label>
                <textarea
                  id="raw-json-input"
                  rows={8}
                  value={rawJson}
                  onChange={(e) => setRawJson(e.target.value)}
                  placeholder='Paste { "violations": [...] } or [{ "title": "Missing alt text", "wcagCriterion": "1.1.1 Non-text Content", "severity": "serious" }]'
                  className="w-full p-3 font-mono text-xs rounded-lg bg-slate-950 text-slate-200 border border-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCustomImport}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium transition"
                >
                  {loading ? 'Parsing & Importing...' : 'Parse & Import Findings'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

