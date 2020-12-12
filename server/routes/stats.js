const statsRouter = require('express').Router()
const db = require('../db/index')
const passport = require('passport')
const ensureAuth = require('../sec/ensureAuth')

statsRouter.route('/avg').get(ensureAuth, async (req, res) => {
    try {
        const result = await db.query("SELECT EXTRACT(YEAR FROM date) as Year, EXTRACT(MONTH FROM date) as Month, type, ROUND(AVG(amount)::numeric, 2) FROM transactions GROUP BY owner_id, Year, Month, type HAVING owner_id=$1 ORDER BY Month", [req.user.id])

        res.status(200).json({
            status: "Success",
            data: result.rows
        })
    }
    catch(err){console.log(err)}
})

module.exports = statsRouter;