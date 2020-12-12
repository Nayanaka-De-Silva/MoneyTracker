import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Backend from '../apis/Backend';
import ReactFrappeChart from 'react-frappe-charts';

const MonthlyAverage = () => {
    const [monthlyExpenses, setMonthlyExpenses] = useState([])
    const [monthlyIncomes, setMonthlyIncomes] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await Backend.get('/stats/avg')
                const averages = response.data.data
                
                const exp = averages.filter(el => el.type === 'Expense')
                setMonthlyExpenses(exp) 

                const inc = averages.filter(el => el.type === 'Income')
                setMonthlyIncomes(inc)
            }
            catch(err){console.log(err)}
        }
        fetch()
    },[])

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h5 className="text-center">Monthly Expenses</h5>
                    <ReactFrappeChart 
                        type="line"
                        colors={["#ba2147"]}
                        axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                        height={250}
                        data={{
                            labels: monthlyExpenses.map(cat => `${cat.month}/${cat.year}`), 
                            datasets: [{values: monthlyExpenses.map(cat => cat.round)}],
                        }}
                    />
                </div>
                <div className="col">
                    <h5 className="text-center">Monthly Incomes</h5>
                    <ReactFrappeChart 
                        type="line"
                        colors={["#21ba45"]}
                        axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                        height={250}
                        data={{
                            labels: monthlyIncomes.map(cat => `${cat.month}/${cat.year}`), 
                            datasets: [{values: monthlyIncomes.map(cat => cat.round)}],
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default MonthlyAverage