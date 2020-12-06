import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Backend from '../apis/Backend';
import Header from '../components/Header';
import TransView from '../components/TransView';
import { WalletContext } from '../context/WalletContext';

const WalletView = () => {
    const history = useHistory();

    const { selectedWallet, setSelectedWallet, setSelectedTransaction } = useContext(WalletContext);
    const [transactions, setTransactions] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await Backend.get(`/wallets/${selectedWallet.id}`);
                setTransactions(response.data.data);
                setSelectedWallet({...selectedWallet, current_balance: response.data.balance.current_balance})
                console.log(response.data.data[0].date)
                console.log(response.data.data)
                console.log(new Date(response.data.data[0].date))
            } catch(err) {
                history.push("/session");
            }
        }
        fetchData();
    }, [history, selectedWallet, setSelectedWallet])

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
            
            <TransView transactions={transactions} setTransactions={setTransactions} />
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