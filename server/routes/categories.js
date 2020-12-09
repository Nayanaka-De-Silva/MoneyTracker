const categoryRouter = require('express').Router()
const db = require('../db/index')


// ----- CATEGORY ROUTES -----

// Get all user categories
categoryRouter.get('/', async (req, res) => {
    if (req.user !== undefined){
        try {
            const category_result = await db.query("SELECT categories.id, categories.name, categories.type, COUNT(transactions.id), SUM(transactions.amount) FROM transactions LEFT JOIN categories ON transactions.category_id = categories.id WHERE transactions.owner_id=$1 GROUP BY categories.id;", [req.user.id])
            res.status(200).json({
                status: "Success",
                data: category_result.rows
            })
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

// Update (or delete) categories
categoryRouter.put('/:id', async (req, res) => {
    if (req.user !== undefined){
        try {
            // Check if the user wants to delete the category
            if (req.body.option === "delete") {
                const category_id = req.params.id
                if (req.body.deleteTransactions) {
                    // Delete all transactions with the category
                    await db.query("DELETE FROM transactions WHERE owner_id=$1 AND category_id=$2", [req.user.id, category_id])
                }
                else {
                    // Update all the transactions with the category and make the category_id null
                    await db.query("UPDATE transactions SET category_id=null WHERE category_id=$1 AND owner_id=$2", [category_id, req.user.id])
                }
                await db.query("DELETE FROM categories WHERE id=$1 AND owner_id=$2", [category_id, req.user.id])
                res.status(204).json({
                    status: "Success",
                    data: "Category deleted"
                })
            }
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

module.exports = categoryRouter