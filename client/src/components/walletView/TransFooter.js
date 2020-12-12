import React from 'react';

const TransFooter = ({handleIncome, handleExpense, handleTransfer}) => {
    return (
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-sm text-center mb-3">
                        <button onClick={handleIncome} className="btn btn-success">Add Income</button>
                    </div>
                    <div className="col-sm text-center mb-3">
                        <button onClick={handleExpense} className="btn btn-danger">Add Expense</button>
                    </div>
                    <div className="col-sm text-center mb-3">
                        <button onClick={handleTransfer} className="btn btn-primary">Add Transfer</button>
                    </div>
                </div>
            </div>
    )
}

export default TransFooter