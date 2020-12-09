const userRouter = require('express').Router()
const { getHashedPassword, generateAuthToken } = require('../sec/hash');
const hash = require('../sec/hash');
const db = require('../db/index');

const authTokens = {};

// ----- USER ROUTES -----

// Login
userRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const result = await db.query("SELECT id, username, password FROM users WHERE username=$1", [username]);
    if (result.rowCount===0) return res.status(404).json({status: "Fail", data: "Username not found."})

    if (result.rows[0].password !== hashedPassword) return res.status(400).json({status: "Fail", data: "Password incorrect"})

    const authToken = generateAuthToken();
    authTokens[authToken] = { id: result.rows[0].id, username: result.rows[0].username };
    res.cookie('AuthToken', authToken);

    res.status(200).json({
        status: "Success",
        data: result.rows[0].username
    })
})

// Logout
userRouter.get('/logout', (req, res) => {
    const authToken = req.cookies['AuthToken'];
    authTokens[authToken] = undefined;
    res.status(200);
})

// Register User
userRouter.post("/register", async (req, res) => {
    try {
        if (req.body.password !== req.body.confirmPassword) return res.status(200).json({status: "Fail", data: "Passwords don't match. Please try again."});
        
        const usernames = await db.query("SELECT username FROM users WHERE username=$1", [req.body.username]);
        if (usernames.rowCount > 0) return res.status(200).json({status: "Fail", data: "User already exists. Please choose another username."});

        const hashedPassword = hash.getHashedPassword(req.body.password);

        const result = await db.query('INSERT INTO users(username, password) VALUES($1, $2) returning username', [req.body.username, hashedPassword]);
        res.status(201).json({
            status: "Success",
            data: result.rows[0]
        })
    } catch (err) {console.log(err)}
})

module.exports = {userRouter, authTokens}