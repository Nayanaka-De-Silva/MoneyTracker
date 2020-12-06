import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { WalletContext } from '../context/WalletContext';
import { PieChart, Pie, Tooltip } from 'recharts';

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
                    <div className="col">
                        <h5 className="text-center">Income</h5>
                        <PieChart width={400} height={400}>
                            <Pie dataKey="value" nameKey="name" isAnimationActive={true} data={incomesCategories} cx={200} cy={200} outerRadius={80} fill="#3ef75d" label />
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="col">
                        <h5 className="text-center">Expenses</h5>
                        <PieChart width={400} height={400}>
                            <Pie dataKey="value" nameKey="name" isAnimationActive={true} data={expensesCategories} cx={200} cy={200} outerRadius={80} fill="#eb584d" label />
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="col">
                        <h5 className="text-center">Transfers</h5>
                        <PieChart width={400} height={400}>
                            <Pie dataKey="value" nameKey="name" isAnimationActive={true} data={transfersCategories} cx={200} cy={200} outerRadius={80} fill="#4d8bf0" label />
                            <Tooltip />
                        </PieChart>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryView;