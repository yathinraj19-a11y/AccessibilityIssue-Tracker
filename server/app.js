const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const issueRoutes = require('./routes/issueRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers with CSP relaxed for demo embeds/styles
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Enable CORS for frontend
app.use(cors({
  origin: true,
  credentials: true
}));

// Request body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/issues', issueRoutes);
app.use('/api/stats', statsRoutes);

// Health check direct alias
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AccessibilityIssue Tracker API', time: new Date() });
});

// Serve frontend build if present (for single-server production deployment)
const clientBuildPath = path.join(__dirname, '../dist');
app.use(express.static(clientBuildPath));

// API 404 handler for unmatched /api routes
app.use('/api', notFoundHandler);

// Fallback to client SPA index.html for non-API client routes
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If client is not built yet (dev mode)
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Accessibility Remediation Board API</title>
        </head>
        <body style="font-family: system-ui, sans-serif; padding: 2.5rem; line-height: 1.6; max-width: 700px; margin: auto;">
          <h1 style="color: #2563eb;">Accessibility Issue Tracker API</h1>
          <p>The backend REST API is running successfully!</p>
          <h3>Available Endpoints:</h3>
          <ul>
            <li><a href="/api/issues"><code>GET /api/issues</code></a> - All accessibility issues (filter by status, severity, etc.)</li>
            <li><a href="/api/stats"><code>GET /api/stats</code></a> - Remediation metrics & compliance scorecard</li>
            <li><a href="/api/health"><code>GET /api/health</code></a> - Health status</li>
          </ul>
        </body>
        </html>
      `);
    }
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
