const transactionRouter = require('express').Router()
const db = require('../db/index')

// -----TRANSACTION ROUTES -----

// Add Transaction
transactionRouter.post("/:id", async (req, res) => {
    if (req.user !== undefined) {
        try {
            // Check for errors
            if (req.body.type === "Transfer" && (req.body.transfer_id === 0 || req.body.transfer_id === undefined)) return res.status(200).json({ status: "Fail", data: "Please select the wallet to transfer to" });

            // Category checks
            let newCategory = false;
            let category_id = null;
            if (req.body.category === "None" || req.body.category === "") req.body.category = null;
            console.log(req.body.category);

            // Check if category is added
            if (req.body.category){
                // Check if the category exists in table
                const categories = await db.query("SELECT id FROM categories WHERE name=$1 AND owner_id=$2 AND type=$3", [req.body.category, req.user.id, req.body.type])
                category_id = categories.rowCount > 0 ? categories.rows[0].id : null;
                if (!category_id) {
                    // Category doesn't exsist and needs to be added
                    const category_result = await db.query("INSERT INTO categories (name, type, owner_id) VALUES ($1, $2, $3) returning id", [req.body.category, req.body.type, req.user.id])
                    category_id = category_result.rows[0].id;
                    newCategory = true;
                }
            }

            // Add the transaction to the database
            const result = await db.query("INSERT INTO transactions(details, type, amount, owner_id, wallet_id, category_id) VALUES($1, $2, $3, $4, $5, $6) returning id, details, type, TO_CHAR(date, 'dd/mm/yyyy') AS date, amount;", [
                req.body.details,
                req.body.type,
                req.body.type === "Income" ? 1*req.body.amount : -1*req.body.amount,
                req.user.id,
                req.params.id,
                category_id
            ])
            const category_result = newCategory ? await db.query("SELECT id, name, type FROM categories WHERE id=$1",[category_id]) : null
            if (result) {
                // When an expense or income is recorded
                if (req.body.type !== "Transfer") {
                    const int_amt = req.body.type === "Expense" ? -1*req.body.amount : 1*req.body.amount;
                    const result_wallet = await db.query("SELECT current_balance FROM wallets WHERE id=$1 AND owner_id=$2;", [req.params.id, req.user.id]);
                    const newBalance = result_wallet.rows[0].current_balance + int_amt;
                    const result_balance = await db.query("UPDATE wallets SET current_balance=$1 WHERE id=$2 AND owner_id=$3", [newBalance, req.params.id, req.user.id]);
                }
                else {
                    // Transfer is recorded
                    // Deduct amount from current wallet
                    const transfer_amt = -1*req.body.amount;
                    const result_wallet = await db.query("SELECT current_balance FROM wallets WHERE id=$1 AND owner_id=$2;", [req.params.id, req.user.id]);
                    const newBalance = result_wallet.rows[0].current_balance + transfer_amt;
                    await db.query("UPDATE wallets SET current_balance=$1 WHERE id=$2 AND owner_id=$3", [newBalance, req.params.id, req.user.id]);
                    
                    // Record transaction on other wallet
                    const other_wallet_result = await db.query("INSERT INTO transactions(details, type, amount, owner_id, wallet_id, category_id) VALUES($1, $2, $3, $4, $5, $6) returning id, details, type, TO_CHAR(date, 'dd/mm/yyyy') AS date, amount;", [
                        req.body.details,
                        req.body.type,
                        req.body.amount,
                        req.user.id,
                        req.body.transfer_id,
                        category_id
                    ]);

                    // Increase balance on other wallet
                    const other_wallet_balance_result = await db.query("SELECT current_balance FROM wallets WHERE id=$1 AND owner_id=$2;", [req.body.transfer_id, req.user.id]);
                    const newOtherBalance = other_wallet_balance_result.rows[0].current_balance + parseFloat(req.body.amount);
                    await db.query("UPDATE wallets SET current_balance=$1 WHERE id=$2 AND owner_id=$3", [newOtherBalance, req.body.transfer_id, req.user.id]);
                
                    // Record the two transaction ids in the transfer table (For future reference)
                    db.query("INSERT INTO transfers(transfer_from, transfer_to) VALUES($1, $2);", [result.rows[0].id, other_wallet_result.rows[0].id])
                }
                res.status(200).json({
                    status: "Success",
                    data: result.rows[0],
                    category: newCategory ? category_result.rows[0] : null
                });
            } else {
                res.status(500).json({
                    status: "Fail",
                    data: "Transaction failed. Please try again."
                });
            }
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

// Remove Transaction
transactionRouter.delete('/:id', async (req, res) => {
    if (req.user !== undefined) {
        try {
            // Retrieve wallet_id from id of the transaction
            const result0= await db.query("SELECT wallet_id FROM transactions WHERE id=$1 AND owner_id=$2", [req.params.id, req.user.id])
            const wallet_id = result0.rows[0].wallet_id;

            // Obtain the current balance of the wallet in question
            const result1 = await db.query("SELECT current_balance FROM wallets WHERE id=$1 AND owner_id=$2", [wallet_id, req.user.id])
            let current_balance = parseFloat(result1.rows[0].current_balance);
            
            // Obtain the transaction information needed to counter balance the wallet's current_balance
            const result2 = await db.query("SELECT type, amount FROM transactions WHERE id=$1 AND owner_id=$2", [req.params.id, req.user.id])
            const type = result2.rows[0].type;
            const amount = parseFloat(result2.rows[0].amount)

            current_balance -= amount;

            await db.query("UPDATE wallets SET current_balance=$1 WHERE id=$2 AND owner_id=$3", [current_balance, wallet_id, req.user.id])
            await db.query("DELETE FROM transactions WHERE id=$1", [req.params.id])

            if (type === "Transfer") {
                // Retrieve the other transfer
                const transfer_result = await db.query("SELECT transfer_from, transfer_to FROM transfers WHERE transfer_from=$1 OR transfer_to=$2;", [req.params.id, req.params.id])
                const transfer_id = transfer_result.rows[0].transfer_from === req.params.id ? transfer_result.rows[0].transfer_to : transfer_result.rows[0].transfer_from;
                
                // Retrieve the wallet_id
                const transfer_result1 = await db.query("SELECT wallet_id FROM transactions WHERE id=$1 AND owner_id=$2", [transfer_id, req.user.id]);
                const transfer_wallet_id = transfer_result1.rows[0].wallet_id;

                // Get the balance of the transfer wallet
                const transfer_result2 = await db.query("SELECT current_balance FROM wallets WHERE id=$1 AND owner_id=$2", [transfer_wallet_id, req.user.id])
                let transfer_current_balance = transfer_result2.rows[0].current_balance;

                // Obtain the transacton amount to counterbalance the current_balance of the transfer
                const transfer_result3 = await db.query("SELECT amount FROM transactions WHERE id=$1 AND owner_id=$2", [transfer_id, req.user.id]);
                const transfer_amount = transfer_result3.rows[0].amount;

                transfer_current_balance -= transfer_amount;

                // Update new transfer current balance
                await db.query("UPDATE wallets SET current_balance=$1 WHERE id=$2 AND owner_id=$3", [transfer_current_balance, transfer_wallet_id, req.user.id]);
                await db.query("DELETE FROM transactions WHERE id=$1", [transfer_id]);
                await db.query("DELETE FROM transfers WHERE transfer_from=$1 OR transfer_to=$2", [transfer_id, transfer_id]);
            }

            res.status(200).json({
                status: "Success",
                data: current_balance
            })
            current_balance -= amount;
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

module.exports = transactionRouter