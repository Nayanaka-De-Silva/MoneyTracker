import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Backend from '../apis/Backend';
import Header from '../components/Header';
import TransView from '../components/TransView';
import { WalletContext } from '../context/WalletContext';
import { Tabs, Tab } from 'react-bootstrap';


const WalletView = () => {
    const history = useHistory();

    const { selectedWallet, setSelectedWallet, setSelectedTransaction } = useContext(WalletContext);
    const [transactions, setTransactions] = useState([]);
    const [ dates, setDates ] = useState([])

    const dates_temp = []

    useEffect(()=>{
        console.log(transactions)    
        console.log(dates)
        const fetchData = async () => {
            try{
                const response = await Backend.get(`/wallets/${selectedWallet.id}`);
                setTransactions(response.data.data);
                setSelectedWallet({...selectedWallet, current_balance: response.data.balance.current_balance})
                
                transactions.forEach(transaction => {
                    if (!dates_temp.includes(transaction.date.slice(3))){
                        dates_temp.push(transaction.date.slice(3))
                    }
                })
                setDates(dates_temp)
                
            } catch(err) {
                history.push("/session");
            }
        }
        fetchData()
    }, [])

    const handleIncome = (e) => {
        e.preventDefault();
        setSelectedTransaction("Income")
        history.push("/addTransaction")
    }
    const handleExpense = (e) => {
        e.preventDefault();
        setSelectedTransaction("Expense")
        history.push("/addTransaction")
    }
    const handleTransfer = (e) => {
        e.preventDefault();
        setSelectedTransaction("Transfer")
        history.push("/addTransaction")
    }
    const handleDelete = async (e) => {
        e.preventDefault();
        if(window.confirm(`Are you sure you want to delete: ${selectedWallet.name}. (This cannot be undone)`)){
            await Backend.delete(`/wallets/${selectedWallet.id}`);
            history.push('/home');
        }
    }

    return (
        <div className="container">
            <button onClick={e=>history.push("/")} className="btn btn-primary mt-1">Logout</button>
            <Header title={selectedWallet.name}/><br />
            <div className="container">
            <div className="row">
                    <div className="col-sm">
                        <button onClick={()=>history.push("/home")}className="btn btn-primary">Back</button>
                    </div>
                    <div className="col-7">
                        <h3 className="text-left display-5">Current Balance: ${selectedWallet.current_balance}</h3>
                    </div>
                    <div className="col-sm text-right">
                        <button onClick={()=>history.push('/editWallet')} className="btn btn-warning">Edit Wallet</button>
                    </div>
                    <div className="col-sm text-right">
                        <button onClick={handleDelete} className="btn btn-danger">Delete Wallet</button>
                    </div>
                </div>
            </div>
            
            <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
                <Tab eventKey="all" title="All">
                    <TransView transactions={transactions} setTransactions={setTransactions} />
                </Tab>
                {
                    dates.map(date => <Tab eventKey={date} title={date}><TransView transactions={transactions.filter(trans => trans.date.slice(3)===date)} setTransactions={setTransactions} /></Tab>) 
                }                       
            </Tabs>

            <div className="container">
                <div className="row">
                    <div className="col-sm text-center">
                        <button onClick={handleIncome} className="btn btn-success">Add Income</button>
                    </div>
                    <div className="col-sm text-center">
                        <button onClick={handleExpense} className="btn btn-danger">Add Expense</button>
                    </div>
                    <div className="col-sm text-center">
                        <button onClick={handleTransfer} className="btn btn-primary">Add Transfer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletView;