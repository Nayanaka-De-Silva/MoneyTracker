require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Route Imports
const {userRouter, authTokens} = require('./routes/users')
const walletRouter = require('./routes/wallets')
const transactionRouter = require('./routes/transactions')
const categoryRouter = require('./routes/categories')

// Middleware Imports
const middleware = require('./utils/middleware')

// Create Express server
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(middleware.authentication);



// Routes
app.use('/api/v1/moneytracker/users', userRouter)
app.use('/api/v1/moneytracker/wallets', walletRouter)
app.use('/api/v1/moneytracker/transactions', transactionRouter)
app.use('/api/v1/moneytracker/categories', categoryRouter)

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`Server is running on PORT=${port}`);
})