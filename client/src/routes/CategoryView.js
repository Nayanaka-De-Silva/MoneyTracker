import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { WalletContext } from '../context/WalletContext';
import ReactFrappeChart from 'react-frappe-charts';
import MonthlyAverage from '../components/MonthlyAverage';

let expensesData = []
let incomesData = []
let transfersData = []

const CategoryView = () => {
    const { categories } = useContext(WalletContext)

    const [ incomesCategories, setIncomesCategories ] = useState([])
    const [ expensesCategories, setExpensesCategories ] = useState([])
    const [ transfersCategories, setTransfersCategories ] = useState([])

    useEffect(()=>{
        // Processing Expenses Categories
        let expensesUnfiltered = categories.filter(category => category.type === "Expense")
        expensesUnfiltered.forEach(element => {
            expensesData.push({name: element.name, value: Math.abs(parseFloat(element.sum))})
        });
        setExpensesCategories(expensesData)
        expensesData = []

        // Processing Incomes Categories
        let incomesUnfiltered = categories.filter(category => category.type === "Income")
        incomesUnfiltered.forEach(element => {
            incomesData.push({name: element.name, value: Math.abs(parseFloat(element.sum))})
        });
        setIncomesCategories(incomesData)
        incomesData = []

        // Processing Transfers Categories
        let transfersUnfiltered = categories.filter(category => category.type === "Transfer")
        transfersUnfiltered.forEach(element => {
            transfersData.push({name: element.name, value: Math.abs(parseFloat(element.sum))})
        });
        setTransfersCategories(transfersData)
        transfersData = []
    }, [categories])


    return (
        <div className="container">
            <Header title="Detailed View"/>
            <div className="container">
                <div className="row">
                    {incomesCategories ?  
                    <div className="col-sm">
                        <h5 className="text-center">Income</h5>
                        <ReactFrappeChart 
                                type="bar"
                                colors={["#21ba45"]}
                                axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                                height={250}
                                data={{
                                    labels: incomesCategories.map(cat => cat.name), 
                                    datasets: [{values: incomesCategories.map(cat => cat.value)}],
                                }}
                            />
                    </div>
                    :<></>}
                    { expensesCategories ? 
                    <div className="col-sm">
                        <h5 className="text-center">Expenses</h5>
                        <div className='justify-content-center'>
                            <ReactFrappeChart 
                                type="bar"
                                colors={["#ba2147"]}
                                axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                                height={250}
                                data={{
                                    labels: expensesCategories.map(cat => cat.name), 
                                    datasets: [{values: expensesCategories.map(cat => cat.value)}],
                                }}
                            />
                        </div>
                    </div>
                    : <></>}
                    {transfersCategories ? 
                    <div className="col">
                        <h5 className="text-center">Transfers</h5>
                        <div className='justify-content-center'>
                            <ReactFrappeChart 
                                type="bar"
                                colors={["#4343e6"]}
                                axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                                height={250}
                                data={{
                                    labels: transfersCategories.map(cat => cat.name), 
                                    datasets: [{values: transfersCategories.map(cat => cat.value)}],
                                }}
                            />
                        </div>
                    </div>
                    :<></>}
                </div>
            </div>
            <MonthlyAverage />
        </div>
    )
}

export default CategoryView;