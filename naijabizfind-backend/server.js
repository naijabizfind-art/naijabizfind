import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route modules
import businessRoutes from './routes/businesses.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- GLOBAL MIDDLEWARES ---

// CORS Configuration: Allows React frontend workspaces to securely connect to our live API
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow request headers with no origin (such as server-to-server or Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed by policy`));
  },
  credentials: true
}));

// IMPORTANT: Paystack Webhook must be parsed as raw data BEFORE standard JSON conversion
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Parse standard JSON bodies for all other routes
app.use(express.json());

// --- API ROUTES ---
app.use('/api/businesses', businessRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// API Health Check
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'NaijaBizFind API is live 🚀',
    version: '1.0.0',
    endpoints: {
      businesses: '/api/businesses',
      payments: '/api/payments',
      admin: '/api/admin',
      upload: '/api/upload'
    }
  });
});

// --- SERVE STATIC FRONTEND BUILD IN PRODUCTION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve compiled static files from our React frontend workspace
app.use(express.static(path.join(__dirname, '../naijabizfind/dist')));

// For any non-API request, fallback to React's client-side routing
app.get('*', (req, res, next) => {
  // If the path starts with /api, let it fall through to error handling (don't serve index.html)
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../naijabizfind/dist', 'index.html'));
});

// --- CENTRAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// --- DATABASE CONNECTION & RUN ENGINE ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/naijabizfind';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('🔌 MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 NaijaBizFind Monorepo Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });