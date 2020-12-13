const budgetRouter = require('express').Router()
const db = require('../db')
const ensureAuth = require('../sec/ensureAuth')

budgetRouter.post('/', ensureAuth, async (req, res) => {
    try{
        // Ensure values and validated
        if (req.body.goal < 100) return res.status(400).json({status: "Fail", message: "Please select a goal of more than 100"})
        if (req.body.days < 1) return res.status(400).json({statis: "Fail", message: "Days cannot be 0. Please try again."})
        
        // Create a Budget
        const response = await db.query("INSERT INTO budgets(owner_id, goal, days, remaining_bal, today_bal) VALUES($1, $2, $3, $2, 0)", [req.user.id, Math.round(req.body.goal,2), req.body.days])
        
        res.status(200).json({
            status: "Success",
            message: "Budget created"
        })
    } catch(err){
        console.log(err)
        res.status(500).json({
            status: "Failed",
            message: "Please try again."
        })
    } 
})

budgetRouter.get('/', ensureAuth, async (req, res) => {
    try {
        // Obtain budget details from the database
        const budget = await db.query("SELECT * FROM budgets WHERE owner_id=$1", [req.user.id])
        
        // Check if there is a budget
        if (budget.rowCount < 1) {
            // If no budget, return 200 OK and indicate there is no budget
            return res.status(200).json({
                status: "None",
                data: "No budget",
            })
        }

        // Determine the number of days remaining
        const result = await db.query("SELECT starting_date + days - last_update as diff FROM budgets WHERE owner_id=$1", [req.user.id])
        const remaining_days = result.rows[0].diff

        // Check if there are remaining days left for the budget
        if (remaining_days <= 0){
            // Budget complete
            res.status(200).json({
                status: "Complete",
                data: budget.rows[0].remaining_bal
            })
            // Remove Budget
            await db.query("DELETE FROM budgets WHERE id=$1", [budget.rows[0].id])
        }
        else {
            // Determine the Exp_per_day
            const Exp_per_day = Number.parseFloat(budget.rows[0].remaining_bal / remaining_days).toFixed(2)

            // Check if the last transaction was today
            const response = await db.query("SELECT last_update - CURRENT_DATE as diff FROM budgets")
            //console.log("Last update: ", typeof(budget.rows[0].last_update))
            //console.log("Current date: ", typeof(current_date.rows[0].current_date))
            //console.log("Diff: ", response.rows[0].diff) 
            if (response.rows[0].diff <= 0){
                res.status(200).json({
                    status: "Active",
                    new: false,
                    data: {
                        today_bal: budget.rows[0].today_bal,
                        Exp_per_day: Exp_per_day
                    }
                })
            }
            else {
                // Reset the last_update to the current day and set today's balance to 0 (New day)
                //const last_update = new Date.now()
                let remaining_bal = budget.rows[0].remaining_bal
                remaining_bal -= budget.rows[0].today_bal
                //const today_bal = 0
                
                // Send new information to database
                const newBudget = await db.query("UPDATE budgets SET last_update=CURRENT_DATE, remaining_bal=$1, today_bal=0 WHERE owner_id=$2", [remaining_bal, req.user.id])
                res.status(200).json({
                    status: "Active",
                    new: true,
                    data: {
                        today_bal: budget.rows[0].today_bal,
                        Exp_per_day: Exp_per_day
                    }
                })
            }
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "Failed",
            message: "Please try again"
        })
    }
})

budgetRouter.delete('/', ensureAuth, async (req, res) => {
    try {
        // Delete the budget
        await db.query("DELETE FROM budgets WHERE owner_id=$1", [req.user.id])

        // Send response status
        res.status(204).json({
            status: "Success",
            message: "Budget deleted" 
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "Failed",
            message: "Please try again"
        })
    }
})

module.exports = budgetRouter