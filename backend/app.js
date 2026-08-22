const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Fire off the DB connection. Mongoose queues queries until the connection
// is ready, so we don't need to await this before wiring up routes.
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'Thrifto API is running' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));

// Serve admin-uploaded product photos.
// NOTE: on Vercel this folder is NOT persistent (see README) — this line is
// kept so the app still works unchanged on traditional hosts (Render,
// Railway, a VPS, etc).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In production on a traditional (non-Vercel) host, serve the built React
// app from the same process/port as the API. On Vercel the frontend is
// deployed separately as static files via vercel.json, so this block simply
// never matches there.
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const frontendBuild = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
