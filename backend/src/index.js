require('dotenv').config(); // load .env into process.env
const express = require('express'); 
const cors = require('cors'); 
const db = require('./db')  // Firestore instance

const app = express(); 
const PORT = process.env.PORT || 8080; 

// ----MIDDLEWARE----
// CORs(Cross Origin Reference)
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5000', 'https://sp2025-inf124.web.app', 'https://sp2025-inf124.firebaseapp.com'], //adjust to React dev server or prod URL
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true
}));
app.use(express.json()); // parse JSON bodies

/// ----ROUTES----
// Health Check
app.get('/api/health-check', (req, res) => {
    res.status(200).send('Health Check: OK');
});

// Other routers go here 
const userRouter = require('./routes/user'); 
app.use('/api/users', userRouter);

const locationRouter = require("./routes/location");
app.use('/api/location', locationRouter);

const conditionsRouter = require("./routes/conditions");
app.use('/api/conditions', conditionsRouter);

// ----START SERVER----
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})