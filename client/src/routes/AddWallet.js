import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Backend from '../apis/Backend';
import Header from '../components/Header'
import { WalletContext } from '../context/WalletContext';

const AddWallet = () => {
    const history = useHistory();
    const { addWallet } = useContext(WalletContext);

    const [name, setName] = useState("");
    const [type, setType] = useState("Type");
    const [starting_balance, setStarting_balance] = useState(0);

    const [errorMessage, setErrorMessage] = useState(null)

    const handleAddWallet = async (e) => {
        e.preventDefault();
        try {
            const response = await Backend.post('/wallets', { name, type, starting_balance });
            
            if (response.data.status === 'Success') {
                addWallet(response.data.data);
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
        <div>
            <Header title="Add Wallet" />
            <form>
                <div className="form-group">
                    <label>Wallet Name</label>
                    <input value={name} onChange={e=>setName(e.target.value)} required type="text" className="form-control" id="name" />
                </div>
                <div className="form-group">
                    <label>Wallet Type</label>
                    <select value={type} onChange={e=>setType(e.target.value)} required className="custom-select" id="type">
                        <option defaultValue disabled>Type</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Starting Balance</label>
                    <input value={starting_balance} onChange={e=>setStarting_balance(e.target.value)} required type="number" className="form-control" id="starting_balance" />
                </div>
                <div onClick={handleAddWallet} className="btn btn-primary">Add Wallet</div>
                {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div>:null}
            </form>
        </div>
    )
}

export default AddWallet