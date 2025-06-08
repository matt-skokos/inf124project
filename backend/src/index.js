require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');                      // your Firestore wrapper
const authMiddleware = require('./middleware/auth');
const userRouter = require('./routes/user');
const locationRouter = require('./routes/location');
const conditionsRouter = require('./routes/conditions');
const notificationsRouter = require('./routes/notifications');

const app = express();
app.use(express.json());
app.use(cors());

// Health check
app.get('/api/health-check', (req, res) => {
  res.status(200).send('Health Check: OK');
});

// Core routes
app.use('/api/users', userRouter);
app.use('/api/location', locationRouter);
app.use('/api/conditions', conditionsRouter);

// Protected endpoints will use authMiddleware internally if needed

// Notifications (FCM + SMS)
app.use('/api/notifications', notificationsRouter);

const PORT = parseInt(process.env.PORT, 10) || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
