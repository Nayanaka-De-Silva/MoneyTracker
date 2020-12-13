require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session')
const passport = require('passport')

// Route Imports
const {userRouter, authTokens} = require('./routes/users')
const walletRouter = require('./routes/wallets')
const transactionRouter = require('./routes/transactions')
const categoryRouter = require('./routes/categories')
const statsRouter = require('./routes/stats')
const budgetRouter = require('./routes/budgets')

// Middleware Imports
const auth = require('./sec/auth')

// Create Express server
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
//app.use(middleware.authentication);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}))
app.use(passport.initialize())
app.use(passport.session())

// Authentication declarations
auth(app)

// Routes
app.use('/api/v1/moneytracker/users', userRouter)
app.use('/api/v1/moneytracker/wallets', walletRouter)
app.use('/api/v1/moneytracker/transactions', transactionRouter)
app.use('/api/v1/moneytracker/categories', categoryRouter)
app.use('/api/v1/moneytracker/stats', statsRouter)
app.use('/api/v1/moneytracker/budgets', budgetRouter)

// Not Found Handler
app.use((req, res, next) => {
    res.status(404).type('text').send('Not Found')
})

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`Server is running on PORT=${port}`);
})