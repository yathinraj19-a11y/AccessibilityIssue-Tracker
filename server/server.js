require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect database (with graceful in-memory fallback if mongo isn't available)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`Accessibility Remediation Board API is running`);
    console.log(`Port: http://localhost:${PORT}`);
    console.log(`API Docs & Health: http://localhost:${PORT}/api/health`);
    console.log(`Issues Endpoint: http://localhost:${PORT}/api/issues`);
    console.log(`=================================================`);
  });
};

startServer();

