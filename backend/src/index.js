require('dotenv').config(); // load .env into process.env
const express = require('express'); 
const cors = require('cors'); 
const db = require('./db')  // Firestore instance

const app = express(); 
const PORT = process.env.PORT || 8080; 

// ----MIDDLEWARE----
app.use(cors({
    origin: ['http://localhost:3000'] //adjust to React dev server or prod URL
}));
app.use(express.json()); // parse JSON bodies

/// ----ROUTES----
// Health Check
app.get('/health-check', (req, res) => {
    res.status(200).send('Health Check: OK');
});

// Other routers go here 
const userRouter = require('./routes/user'); 
app.use('/api/users', userRouter);

const locationRouter = require("./routes/location");
app.use('/api/location', locationRouter);

// ----START SERVER----
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})