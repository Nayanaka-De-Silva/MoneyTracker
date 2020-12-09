const userRouter = require('express').Router()
const { getHashedPassword } = require('../sec/hash');
const db = require('../db/index');
const passport = require('passport')

// ----- USER ROUTES -----

// Login
userRouter.post("/login", passport.authenticate('local'), async (req, res) => {
    /*const { username, password } = req.body;
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
    })*/

    // Obtain current user data
    const user = await db.query('SELECT username FROM users WHERE id=$1', [req.user.id])
    res.status(200).json({
        status: 'Success',
        data: user.rows[0].username
    })
})

// Logout
userRouter.get('/logout', (req, res) => {
    /*const authToken = req.cookies['AuthToken'];
    authTokens[authToken] = undefined;*/
    req.logout();
    res.status(200).json({
        status: 'Success',
        data: 'You have been logged out'
    });
})

// Register User
userRouter.post("/register", 
    async (req, res, next) => {
        // Check if the input passwords match (N.B. May need to change this to a more suitable option)
        if (req.body.password !== req.body.confirmPassword) return res.status(200).json({status: "Fail", data: "Passwords don't match. Please try again."});
        
        try {
            // Check if username already exists in the database
            const usernames = await db.query("SELECT username FROM users WHERE username=$1", [req.body.username])
            if (usernames.rowCount > 0) return res.status(200).json({status: "Fail", data: "User already exists. Please choose a different username."})

            // If username is unique, hash the password
            const hash = getHashedPassword(req.body.password)
            
            // Insert username and password into database
            const newUser = await db.query("INSERT INTO users(username, password) VALUES($1, $2) returning id, username", [req.body.username, hash])

            // Go to next middleware
            next(null, newUser.rows[0])
        }
        catch(err){console.log(err)}
    },
    passport.authenticate('local'),
    (req, res) => {
        res.status(201).json({
            status: "Success",
            data: req.body.username
        })
    }
)

module.exports = {userRouter}