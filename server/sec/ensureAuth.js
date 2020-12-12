const passport = require('passport')

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).json({
        status: "Failed",
        message: "Unauthorized"
    })
}

module.exports = ensureAuth