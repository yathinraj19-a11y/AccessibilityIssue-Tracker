const issueService = require('../services/issueService');
const { getDbStatus } = require('../config/db');

// @desc Get remediation statistics and metrics
// @route GET /api/stats
const getStats = async (req, res, next) => {
  try {
    const stats = await issueService.getRemediationStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc Health check endpoint
// @route GET /api/health
const getHealth = (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    version: '1.0.0'
  });
};

module.exports = {
  getStats,
  getHealth
};

