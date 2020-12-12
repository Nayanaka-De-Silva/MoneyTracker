import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Backend from '../apis/Backend';
import Header from '../components/Header';
import TransView from '../components/walletView/TransView';
import TransHeader from '../components/walletView/TransHeader';
import TransFooter from '../components/walletView/TransFooter';
import { WalletContext } from '../context/WalletContext';
import { Tabs, Tab } from 'react-bootstrap';

const WalletView = () => {
    const history = useHistory();

    const { selectedWallet, setSelectedWallet, setSelectedTransaction } = useContext(WalletContext);
    const [transactions, setTransactions] = useState([]);
    const [ dates, setDates ] = useState([])

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await Backend.get(`/wallets/${selectedWallet.id}`);
                setTransactions(response.data.data);
                setSelectedWallet({...selectedWallet, current_balance: response.data.balance.current_balance})
                
                const dates_temp = []
                
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
    },[transactions])

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
        <div>
            <button onClick={e=>history.push("/")} className="btn btn-primary ml-1 mt-1">Logout</button>
            <Header title={selectedWallet.name}/><br />
            <div>
                <TransHeader current_balance={selectedWallet.current_balance} handleDelete={handleDelete}/>
                <div className="container p-0">
                <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
                    <Tab eventKey="all" title="All">
                        <TransView transactions={transactions} setTransactions={setTransactions} />
                    </Tab>
                    {
                        dates && dates.map(date => <Tab eventKey={date} title={date}><TransView transactions={transactions.filter(trans => trans.date.slice(3)===date)} setTransactions={setTransactions} /></Tab>) 
                    }                       
                </Tabs>
                </div>
                <TransFooter handleIncome={handleIncome} handleExpense={handleExpense} handleTransfer={handleTransfer} />
            </div>
        </div>
    )
}

export default WalletView;