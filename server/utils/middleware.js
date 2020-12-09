const authTokens = require('../routes/users').authTokens

const authentication = (req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
};

module.exports = {authentication}