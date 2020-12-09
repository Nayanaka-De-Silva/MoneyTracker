const walletRouter = require('express').Router()
const db = require('../db/index')

// ----- WALLET ROUTES -----

// Get all user's wallets
walletRouter.get('/', async (req, res) => {
    if (req.user !== undefined) {
        try {
            const result = await db.query("SELECT wallets.id, wallets.name, wallets.type, wallets.current_balance FROM wallets JOIN users ON wallets.owner_id = users.id WHERE users.id = $1", [req.user.id]);
            const result2 = await db.query("SELECT id, name, type FROM categories WHERE owner_id=$1",[req.user.id])
            res.status(200).json({
                status: "Success",
                count: result.rowCount,
                data: result.rows,
                categories: result2.rows
            })
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

// Get single wallet data
walletRouter.get('/:id', async (req, res) => {
    // Get all the transactions for a single wallet
    if (req.user) {
        try {
            const result = await db.query("SELECT transactions.id, transactions.details, transactions.type, TO_CHAR(transactions.date, 'dd/mm/yyyy') AS date, transactions.amount, categories.name AS category_name FROM transactions LEFT JOIN categories ON transactions.category_id = categories.id WHERE transactions.owner_id=$1 AND transactions.wallet_id=$2 ORDER BY transactions.id", [req.user.id, req.params.id]);
            const balance = await db.query("SELECT current_balance FROM wallets WHERE id=$1 AND owner_id=$2", [req.params.id, req.user.id]);
            res.status(200).json({
                status: "Success",
                count: result.rowCount,
                data: result.rows,
                balance: balance.rows[0]
            })
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

// Add New Wallet
const walletType = ['Cash', 'Bank']
walletRouter.post('/', async (req, res) => {
    if (req.user !== undefined) {
        try {
            if ( walletType.find(type => type === req.body.type) === undefined ) return res.status(200).json({status: "Fail", data: "Please select a type for the wallet"})
            
            // Create new wallet in wallets table
            const result = await db.query("INSERT INTO wallets(name, type, starting_balance, current_balance, owner_id) VALUES($1, $2, $3, $3, $4) returning id, name, type, current_balance;", [
                req.body.name,
                req.body.type,
                req.body.starting_balance,
                req.user.id
            ])

            // Add starting balance transaction into current wallet
            const result0 = await db.query("INSERT INTO transactions(details, type, amount, owner_id, wallet_id) VALUES($1, $2, $3, $4, $5)", [
                "Starting Balance",
                "Starting",
                req.body.starting_balance,
                req.user.id,
                result.rows[0].id
            ])
            res.status(200).json({
                status: "Success",
                data: result.rows[0]
            })
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

// Edit a wallet
walletRouter.put('/:id', async (req, res) => {
    if (req.user !== undefined) {
        try {
            const result = await db.query("UPDATE wallets SET name=$1, type=$2 WHERE id=$3 returning id, name, type, current_balance", [
                req.body.name, 
                req.body.type, 
                req.params.id
            ]);
            res.status(200).json({
                status:"Success",
                data: result.rows[0]
            })
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

// Delete Wallet
walletRouter.delete('/:id', async (req, res) => {
    if (req.user !== undefined) {
        try {
            // Retrieve all transaction in wallet where the transaction is a transfer
            const transfer_result1 = await db.query("SELECT id FROM transactions WHERE type='Transfer' AND wallet_id=$1 AND owner_id=$2", [req.params.id, req.user.id]);
            transfer_result1.rows.map(async (result) => {
                try{
                // Find transaction id of other transaction
                const transfer_table_result = await db.query("SELECT transfer_from, transfer_to FROM transfers WHERE transfer_from=$1 OR transfer_to=$1",[result.id]);
                const transfer_other_id = transfer_table_result.rows[0].transfer_from === result.id ? transfer_table_result.rows[0].transfer_to : transfer_table_result.rows[0].transfer_from;
                
                // Obtain other wallet transaction information
                const transfer_transaction = await db.query("SELECT wallet_id, amount FROM transactions WHERE id=$1 AND owner_id=$2", [transfer_other_id, req.user.id]);
                const transfer_wallet_id = transfer_transaction.rows[0].wallet_id
                const transfer_amount = transfer_transaction.rows[0].amount

                // Obtain wallets current balance
                const transfer_wallet = await db.query("SELECT current_balance FROM wallets WHERE id=$1 AND owner_id=$2", [transfer_wallet_id, req.user.id])
                let current_balance = transfer_wallet.rows[0].current_balance

                // Counter balance current_balance with the amount
                current_balance -= transfer_amount;

                // Update the balance of the wallet and delete the record
                await db.query("UPDATE wallets SET current_balance=$1 WHERE id=$2 AND owner_id=$3", [current_balance, transfer_wallet_id, req.user.id]);
                await db.query("DELETE FROM transactions WHERE id=$1", [transfer_other_id]);
                } catch(err){
                    console.log("An error has occurred: ", err);
                }
            })

            // Drop all transactions in wallet
            const result1 = await db.query("DELETE FROM transactions WHERE wallet_id = $1", [req.params.id])
            const result2 = await db.query("DELETE FROM wallets WHERE id = $1 AND owner_id = $2", [req.params.id, req.user.id])
            res.status(204).json({
                status:"Success"
            })
        } catch(err) {console.log(err)}
    } else {
        res.status(403).json({
            status: "Fail",
            data: "Unauthorized access. Please login again."
        })
    }
})

module.exports = walletRouter