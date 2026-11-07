# AccessibilityIssue Tracker — Accessibility Remediation Board

[![WCAG 2.1 Level AA](https://img.shields.io/badge/WCAG-2.1%20Level%20AA-blue.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![Deploy to Vercel](https://img.shields.io/badge/Vercel-Ready%20to%20Deploy-black.svg)](https://vercel.com)

A web accessibility (a11y) remediation board and audit tracker designed for digital product and engineering teams. While standard automated tools (axe-core, Lighthouse, Pa11y) produce finding lists, teams often struggle to systematically **triage, assign to responsible owners, apply code remediations, and record multi-modal assistive technology verification evidence** prior to VPAT certification and production release.

---

## 🎯 Differentiating Features

1. **Assistive Tech Verification Evidence Suite**:
   - Remediation sign-offs require verified proof beyond code merging.
   - Captures **Assistive Technologies Tested** (NVDA, JAWS, VoiceOver, TalkBack, Keyboard-Only, Color Contrast Analyzer).
   - Verifier credentials, test procedure notes, code diff confirmation, and screen reader announcements.
2. **5-Stage Remediation Workflow**:
   - `Backlog` &rarr; `To Do` &rarr; `In Progress` &rarr; `Ready for Review` &rarr; `Verified & Closed` (+ `Won't Fix / Risk Accepted`).
   - Accessible keyboard-operable status stepping with verification gates.
3. **Audit Import Hub**:
   - **Preloaded Realistic Benchmark Audits**: 1-click import of *RetailCore E-Commerce Checkout Audit* (8 issues) or *CloudPulse SaaS Portal Audit* (6 issues).
   - **axe-core & Lighthouse JSON Importer**: Paste raw JSON exports to automatically generate tracked issues.
   - Manual barrier registration with WCAG criterion presets and impact guidance.
4. **Accessible by Design (Practices What It Preaches)**:
   - WCAG 2.1 AA compliant UI.
   - Screen Reader Live Region (`role="status" aria-live="polite"`) announcing board actions.
   - High-contrast visible focus indicators (`WCAG 2.4.7`).
   - Accessible Skip Link (`WCAG 2.4.1 Bypass Blocks`).
   - High contrast dark/light themes and full keyboard navigability (`Tab`, `Space`, `Enter`, `Esc`).
5. **Remediation Scorecard & VPAT Readiness**:
   - Real-time Accessibility Health Score (0-100), resolution velocity, severity breakdown, and AT testing coverage breakdown.
   - 1-click Export to **CSV**, **JSON**, or **Printable Executive Conformance Report**.

---

## 🏗 Architecture & Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 3.4, Lucide Icons, Context API state management.
- **Backend**: Node.js, Express 4.21 REST API, Helmet security headers, CORS, request validators.
- **Persistence**: MongoDB via Mongoose Schemas with resilient in-memory fallback for immediate zero-config demoing.
- **Deployment**: Native Vercel Serverless Function entrypoint (`api/index.js`) and `vercel.json` SPA routing.

```
├── api/
│   └── index.js             # Vercel Serverless Function entrypoint
├── server/
│   ├── app.js               # Express app configuration & middleware
│   ├── server.js            # Standalone Node.js server listener
│   ├── config/db.js         # Mongoose connection with resilient fallback
│   ├── models/Issue.js      # Mongoose Schema (WCAG criterion, owner, verification)
│   ├── services/issueService.js # Business logic, filtering, compliance stats
│   ├── controllers/         # REST API route controllers
│   ├── middleware/          # Input validation & centralized error handling
│   └── data/sampleReports.js# Benchmark WCAG audits
├── client/
│   ├── src/
│   │   ├── components/      # BoardView, TableView, AnalyticsView, Modals
│   │   ├── context/         # React Context & Screen Reader Announcer
│   │   └── services/api.js  # REST API fetch client
│   └── tailwind.config.js
└── vercel.json              # Vercel deployment configuration
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ and npm installed.
- (Optional) Local MongoDB or MongoDB Atlas URI. If omitted, the app automatically initializes in-memory persistence.

### 2. Install Dependencies
```bash
# In the project root directory
npm install
npm --prefix client install
```

### 3. Run the Development Server
```bash
# Terminal 1: Start Backend API (Port 5000)
npm run server

# Terminal 2: Start Vite React Frontend (Port 3000)
npm run client
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 Production Single-Server Mode

You can run both the frontend and backend from a single Node process:
```bash
# 1. Build client static assets
npm run build

# 2. Start the unified production server
npm start
```
Visit **[http://localhost:5000](http://localhost:5000)**.

---

## ☁️ Deploying to Vercel

The project is preconfigured with `vercel.json` and a serverless entrypoint at `api/index.js`. The build writes the frontend to the repository-root `dist` directory.

### Deployment Steps:
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project** and select your repository.
3. In Project Settings → Build and Deployment, set **Root Directory** to the repository root (not `client`). Keep the configured build command and output directory (`dist`); this ensures Vercel also includes the `/api` serverless function.
4. Configure Environment Variables (Optional):
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/a11y_tracker?retryWrites=true&w=majority`).
   *(If omitted, the app will run in in-memory mode with sample audits).*
5. Click **Deploy**. Vercel will build the React client into `dist` and deploy the serverless API routes under `/api/*`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/issues` | List all findings (supports `?status=`, `?severity=`, `?wcagLevel=`, `?search=`) |
| `POST` | `/api/issues` | Create new accessibility barrier finding |
| `GET` | `/api/issues/:id` | Get finding by database `_id` or readable `issueId` (`A11Y-101`) |
| `PUT` | `/api/issues/:id` | Update finding details, assigned owner, or remediation code |
| `PATCH` | `/api/issues/:id/status` | Update fix status (`backlog`, `todo`, `in_progress`, `ready_for_review`, `verified`) |
| `PATCH` | `/api/issues/:id/verify` | **Submit verification evidence** (AT tested, notes, verifier credentials) |
| `DELETE` | `/api/issues/:id` | Remove a finding |
| `POST` | `/api/issues/import` | Batch import findings from axe-core / Lighthouse / JSON |
| `POST` | `/api/issues/seed-sample` | Seed preloaded benchmark audit (`ecommerce` or `saas`) |
| `POST` | `/api/issues/reset` | Reset board to default demonstration audits |
| `GET` | `/api/stats` | Remediation velocity, WCAG Level & Severity breakdown, AT coverage |
| `GET` | `/api/health` | Health check endpoint |

---

## ♿ Accessibility Compliance Notes
- **Keyboard Navigation**: Full Tab traversal, Esc to dismiss modal dialogues, Space/Enter to activate status controls.
- **Screen Reader Announcements**: Live state changes announced via ARIA live regions for NVDA, JAWS, and VoiceOver.
- **Focus Indicators**: 2px high-contrast focus rings with 2px offset conforming to WCAG 2.4.7 (Level AA).
- **Skip Links**: Accessible top skip link for direct navigation to `#main-content`.
- **Color Contrast**: All text and badge styles maintain at least 4.5:1 contrast against light and dark backgrounds.
