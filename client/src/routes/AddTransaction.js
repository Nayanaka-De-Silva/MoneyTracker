import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Backend from '../apis/Backend';
import { WalletContext } from '../context/WalletContext';
import Header from '../components/Header';

const AddTransaction = () => {
    const { wallets, selectedTransaction, selectedWallet, categories, addCategory } = useContext(WalletContext);
    const history = useHistory();

    const [details, setDetails] = useState("");
    const [type, setType] = useState(selectedTransaction);
    const [amount, setAmount] = useState(0);
    const [transfer_id, setTransfer_id] = useState(0);
    const [category, setCategory] = useState("None")
    const [newCategory, setNewCategory] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);

    const handleAddTransaction = async (e) => {
        try{
            e.preventDefault();
            
            const response = category === "Add" ? await Backend.post(`/transactions/${selectedWallet.id}`, { details, type, amount, transfer_id, category: newCategory }) : await Backend.post(`/transactions/${selectedWallet.id}`, { details, type, amount, transfer_id, category });
            if (response.data.status !== "Success") {
                setErrorMessage(response.data.data);
                setTimeout(()=>setErrorMessage(null), 3000);
            }
            else {
                if (response.data.category) addCategory(response.data.category)
                history.push("/walletView");
            }
        } catch(err){
            //console.log(err);
            history.push("/session");
        }
    }

    return (
        <div>
            <Header title="Add Transaction" />
            <form>
                <br />
                <h4 className="text-center display-4">Adding to: {selectedWallet.name}</h4>
                <div className="form-group">
                    <label>Details</label>
                    <input value={details} onChange={e=>setDetails(e.target.value)} type="text" required className="form-control" id="details" />
                </div>
                <div className="form-group">
                    <label>Transaction Type</label>
                    <select value={type} onChange={e=>setType(e.target.value)} required className="custom-select" id="type">
                        <option disabled>Type</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                        <option value="Transfer">Transfer</option>
                    </select>
                </div>
                {
                    type === "Transfer" ? <div>
                        <label>Transfer to</label>
                        <select value={transfer_id} onChange={e=>setTransfer_id(e.target.value)} required className="custom-select" id="type">
                            <option value="0"disabled>Wallet</option>{
                                wallets && wallets.map(wallet => {
                                    return wallet.id !== selectedWallet.id ? <option key={wallet.id} value={wallet.id}>{wallet.name}</option>:null
                                })
                            }
                        </select>
                    </div> : null
                }
                <div className="form-group">
                    <label>Category</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)} required className="custom-select" id="category">
                        <option value="None">None</option>
                        {
                            categories && categories.map(category => {
                                return category.type === type ? <option key={category.id} value={category.name}>{category.name}</option> : null;
                            })
                        }
                        <option value="Add">...Add New Category</option>
                    </select>
                </div>
                {
                    category === "Add" ? <div>
                        <label>New category name: </label>
                        <input value={newCategory} onChange={e=>setNewCategory(e.target.value)} type="text" className="form-control" id="newCategory" />
                    </div> : null
                }
                <div className="form-group">
                    <label>Amount</label>
                    <input value={amount} onChange={e=>setAmount(e.target.value)} required type="number" className="form-control" id="amount" />
                </div>
                <button onClick={handleAddTransaction} className="btn btn-primary">Add Transaction</button><br />
                {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div>:null}
            </form>
        </div>
    )
}

export default AddTransaction;