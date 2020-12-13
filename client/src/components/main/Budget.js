import React, { useEffect, useState } from 'react'
import Backend from '../../apis/Backend'
import { useHistory } from 'react-router-dom'

const Budget = () => {
    const history = useHistory()
    const [status, setStatus] = useState("")
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await Backend.get('/budgets') 
                setStatus(response.data.status)
                setData(response.data.data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchData()
    }, [])

    const handleDeleteBudget = async (e) => {
        e.preventDefault();
        if(window.confirm(`Are you sure you want to delete the current budget? (This cannot be undone)`)){
            await Backend.delete(`/budgets`);
            history.push('/')
            history.push('/home');
        }
    }

    return (
        <div className="container">
            <div className="text-left display-4">Budget</div>
            <div className="container text-center">
            {
                status === "Active" ? <div>
                    <h5 className="Text-center">Your daily expense limit is: {data.Exp_per_day}</h5>
                    <h5 className="Text-center">Today's expense total: <span className={data.today_bal < data.Exp_per_day ? "text-success" : "text-danger"}>{data.today_bal}</span></h5>
                    <button className="btn btn-danger" onClick={handleDeleteBudget}>Delete Budget</button>
                </div>
                : status === "Completed" ? <div>
                    <h5 className="Text-center">Your budget is complete. The remaining amount is {data.remaining_bal}</h5>
                </div>
                :status === "None" ? <div>
                    <h5 className="Text-center">No active budgets.</h5>
                    <button className="btn btn-primary" onClick={()=>{history.push('/addBudget')}}>Create New Budget</button>
                </div>
                : <div>
                    <h5 className="Text-center">Getting Budgets...</h5>
                </div>
            }
            </div>
        </div>
    )
}

export default Budget