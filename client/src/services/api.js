// API service for Accessibility Remediation Board

const API_BASE = '/api';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.errors = data.errors;
    throw err;
  }
  return data;
};

export const api = {
  // Get all issues with filters
  getIssues: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        searchParams.append(key, val);
      }
    });
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetch(`${API_BASE}/issues${query}`);
    return handleResponse(res);
  },

  // Get single issue by ID
  getIssueById: async (id) => {
    const res = await fetch(`${API_BASE}/issues/${id}`);
    return handleResponse(res);
  },

  // Create new issue
  createIssue: async (payload) => {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Update existing issue
  updateIssue: async (id, payload) => {
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Update status (e.g. Backlog -> In Progress -> Ready for Review -> Verified)
  updateStatus: async (id, status, notes = '', actor = 'Remediation Coordinator') => {
    const res = await fetch(`${API_BASE}/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes, actor })
    });
    return handleResponse(res);
  },

  // Record verification evidence (differentiating feature)
  recordVerification: async (id, verificationPayload) => {
    const res = await fetch(`${API_BASE}/issues/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationPayload)
    });
    return handleResponse(res);
  },

  // Delete an issue
  deleteIssue: async (id) => {
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Batch import findings from JSON / axe / lighthouse
  importBatch: async (issues, sourceName = 'batch-import') => {
    const res = await fetch(`${API_BASE}/issues/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issues, sourceName })
    });
    return handleResponse(res);
  },

  // Seed sample audit
  seedSample: async (auditKey) => {
    const res = await fetch(`${API_BASE}/issues/seed-sample`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditKey })
    });
    return handleResponse(res);
  },

  // Reset to default sample audits
  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/issues/reset`, {
      method: 'POST'
    });
    return handleResponse(res);
  },

  // Get remediation statistics & WCAG compliance metrics
  getStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    return handleResponse(res);
  },

  // Health check
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};

