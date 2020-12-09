const passport = require('passport')
const db = require('../db/index')
const LocalStrategy = require('passport-local')
const { getHashedPassword } = require('../sec/hash')

module.exports = (app) => {
    // Serialize Function
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // Deserialize Function
    passport.deserializeUser(async (id, done) => {
        // Search for database for user id
        const user = await db.query('SELECT id, username, password FROM users WHERE id=$1', [id])
        done(null, user.rows[0])
    })

    // Local Authentication Strategy
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            // Search for user in users table
            const user = await db.query('SELECT id, username, password FROM users WHERE username=$1', [username])
        
            // Check if the user exists
            if (user.rowCount !== 1) { return done(null, false) }

            // The user exists. Obtain hashed password
            hash = getHashedPassword(password)
                
            // Check if the returned password is correct
            if (hash !== user.rows[0].password) { return done(null, false) }

            // If all the check passed, return the user data
            return done(null, user.rows[0])
        }
        catch(err) {
            // If any Errors appear, log and return.
            console.log(err)
            return done(err)
        } 
    }))
}