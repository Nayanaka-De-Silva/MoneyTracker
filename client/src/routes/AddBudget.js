import React, { useState } from 'react'
import Header from '../components/Header'
import Backend from '../apis/Backend'
import { useHistory } from 'react-router-dom'

const AddBudget = () => {
    const history = useHistory()
    const [goal, setGoal] = useState(100)
    const [days, setDays] = useState(1)

    const [errorMessage, setErrorMessage] = useState("")

    const handleAddBudget = async (e) => {
        e.preventDefault();
        try {
            const response = await Backend.post('/budgets', { goal, days });
            
            if (response.data.status === 'Success') {
                console.log(response.data.message)
                history.push('/home');
            }
            else {
                setErrorMessage(response.data.data);
                setTimeout(()=>setErrorMessage(null), 3000);
            }
        } catch(err) {
            //console.log(err)
            history.push("/session")
        }
    }

    return (
        <div className="container">
            <Header title="Add Budget" />
            <h6 className="text-center">The budget will track all your expenses from today until the end of the budget.</h6>
            <h6 className="text-center">Transactions outside the budget date will not be recorded.</h6>
            <h6 className="text-center">The App will track your daily expense limit and track how much you have spent for the day.</h6>
            <h6 className="text-center">The Expenses per day will update after the day ends. Try to keep below the limit.</h6>
            <br />
            <form>
                <div className="form-group">
                    <label>Budget Goal <span className="font-italic">(How much you want to spend?)</span></label>
                    <input value={goal} onChange={e=>setGoal(e.target.value)} required type="number" className="form-control" id="starting_balance" />
                </div>
                <div className="form-group">
                    <label>Number of Days <span className="font-italic">(In how many days?)</span></label>
                    <input value={days} onChange={e=>setDays(e.target.value)} required type="number" className="form-control" id="starting_balance" />
                </div>
                <div onClick={handleAddBudget} className="btn btn-primary">Add Wallet</div>
                {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div>:null}
            </form>
        </div>
    )
}

export default AddBudget