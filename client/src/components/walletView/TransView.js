import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Backend from '../../apis/Backend';
import { WalletContext } from '../../context/WalletContext';

const typeColor = {
    Expense: "bg-danger",
    Income: "bg-success",
    Starting: "bg-info",
    Transfer: "bg-primary"
}

const TransView = ({ transactions, setTransactions }) => {
    
    const history = useHistory();
    const { selectedWallet, setSelectedWallet } = useContext(WalletContext);
    
    const handleDelete = async (trans) => {
        if (trans.details === 'Starting Balance'){
            return null;
        }
        else if (window.confirm(`Are you sure you want to delete transaction: ${trans.details}`)){
            try {
                const response = await Backend.delete(`/transactions/${trans.id}`);
                setTransactions(transactions.filter(transaction=>trans.id !== transaction.id));
                setSelectedWallet({...selectedWallet, current_balance: response.data.data});
            } catch(err) {
                history.push('/session')
            }
        }
    }

    return (
        <table className="table">
            <thead>
                <tr>
                <th scope="col">Date</th>
                {/*<th scope="col">Type</th>*/}
                <th scope="col">Details</th>
                <th scope="col">Category</th>
                <th scope="col">Amt</th>
                {/*<th scope="col">Action</th>*/}
                </tr>
            </thead>
            <tbody>
                {transactions && transactions.map(transaction => {
                    return (<tr onClick={()=>handleDelete(transaction)} key={transaction.id} className={typeColor[transaction.type]}>
                        <td>{transaction.date}</td>
                        {/*<td>{transaction.type}</td>*/}
                        <td><strong>{transaction.details}</strong></td>
                        <td>{transaction.category_name}</td>
                        <td>{transaction.amount < 0 ? "("+-1*transaction.amount+")" : transaction.amount}</td>
                        {/*<td>{transaction.type !== "Starting" ? <p style={{ cursor: "pointer" }} onClick={()=>handleDelete(transaction)}><strong>Remove</strong></p>:null}</td>*/}
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default TransView;