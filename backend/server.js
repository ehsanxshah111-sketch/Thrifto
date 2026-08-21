const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

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

// Serve admin-uploaded product photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In production, serve the built React app from the same port as the API.
// Run "npm run build" in /frontend first (see README) to generate this folder.
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Thrifto server running on port ${PORT}`));
