import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const IssueContext = createContext(null);

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View state: 'board' | 'table' | 'analytics'
  const [viewMode, setViewMode] = useState('board');

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    severity: 'all',
    wcagLevel: 'all',
    source: 'all',
    assignee: ''
  });

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'issue' | 'verify' | 'import' | 'export' | null
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'

  // Accessibility screen reader announcement queue
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message) => {
    setAnnouncement(message);
    // Clear after delay to allow re-announcing same string if needed
    setTimeout(() => setAnnouncement(''), 3000);
  }, []);

  // Fetch all issues based on current filters
  const loadIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getIssues(filters);
      if (res.success) {
        setIssues(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load accessibility findings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const loadStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Could not load statistics', err);
    }
  }, []);

  // Reload data
  const refreshAll = useCallback(async () => {
    await Promise.all([loadIssues(), loadStats()]);
  }, [loadIssues, loadStats]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Create issue
  const createIssue = async (payload) => {
    try {
      const res = await api.createIssue(payload);
      if (res.success) {
        announce(`New finding created: ${res.data.issueId} - ${res.data.title}`);
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      announce(`Error creating issue: ${err.message}`);
      throw err;
    }
  };

  // Update issue
  const updateIssue = async (id, payload) => {
    try {
      const res = await api.updateIssue(id, payload);
      if (res.success) {
        announce(`Updated finding ${res.data.issueId}`);
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      announce(`Error updating issue: ${err.message}`);
      throw err;
    }
  };

  // Move status (Backlog -> Todo -> In Progress -> Ready for Review -> Verified)
  const updateStatus = async (id, newStatus, notes = '') => {
    try {
      const res = await api.updateStatus(id, newStatus, notes);
      if (res.success) {
        announce(`Moved ${res.data.issueId} to ${newStatus.replace('_', ' ')}`);
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      announce(`Error updating status: ${err.message}`);
      throw err;
    }
  };

  // Record verification evidence (differentiating feature)
  const submitVerification = async (id, verificationData) => {
    try {
      const res = await api.recordVerification(id, verificationData);
      if (res.success) {
        announce(`Verification signed off for ${res.data.issueId}. Status: ${res.data.status}`);
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      announce(`Error submitting verification: ${err.message}`);
      throw err;
    }
  };

  // Delete issue
  const deleteIssue = async (id, issueId) => {
    try {
      const res = await api.deleteIssue(id);
      if (res.success) {
        announce(`Deleted finding ${issueId || id}`);
        await refreshAll();
        return true;
      }
    } catch (err) {
      announce(`Error deleting issue: ${err.message}`);
      throw err;
    }
  };

  // Batch import findings
  const importFindings = async (importedList, sourceName) => {
    try {
      const res = await api.importBatch(importedList, sourceName);
      if (res.success) {
        announce(`Imported ${res.data.length} findings from ${sourceName}`);
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      announce(`Import failed: ${err.message}`);
      throw err;
    }
  };

  // Seed sample audit
  const seedSampleAudit = async (key) => {
    try {
      const res = await api.seedSample(key);
      if (res.success) {
        announce(`Seeded sample audit findings from ${key}`);
        await refreshAll();
        return res.data;
      }
    } catch (err) {
      announce(`Seeding failed: ${err.message}`);
      throw err;
    }
  };

  // Reset demo
  const resetDemoBoard = async () => {
    try {
      await api.resetDemo();
      announce('Board reset to standard demonstration audits');
      await refreshAll();
    } catch (err) {
      announce(`Reset failed: ${err.message}`);
      throw err;
    }
  };

  // Open modals
  const openCreateModal = () => {
    setSelectedIssue(null);
    setModalMode('create');
    setActiveModal('issue');
  };

  const openEditModal = (issue) => {
    setSelectedIssue(issue);
    setModalMode('edit');
    setActiveModal('issue');
  };

  const openViewModal = (issue) => {
    setSelectedIssue(issue);
    setModalMode('view');
    setActiveModal('issue');
  };

  const openVerifyModal = (issue) => {
    setSelectedIssue(issue);
    setActiveModal('verify');
  };

  const openImportModal = () => {
    setActiveModal('import');
  };

  const openExportModal = () => {
    setActiveModal('export');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedIssue(null);
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        stats,
        loading,
        error,
        viewMode,
        setViewMode,
        filters,
        setFilters,
        activeModal,
        selectedIssue,
        modalMode,
        announcement,
        announce,
        refreshAll,
        createIssue,
        updateIssue,
        updateStatus,
        submitVerification,
        deleteIssue,
        importFindings,
        seedSampleAudit,
        resetDemoBoard,
        openCreateModal,
        openEditModal,
        openViewModal,
        openVerifyModal,
        openImportModal,
        openExportModal,
        closeModal
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

