import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Backend from '../apis/Backend';
import Header from '../components/Header';
import { WalletContext } from '../context/WalletContext'

const EditWallet = () => {
    const history = useHistory();
    const { selectedWallet, setSelectedWallet } = useContext(WalletContext);

    const [name, setName] = useState(selectedWallet.name);
    const [type, setType] = useState(selectedWallet.type);

    const handleEditWallet = async (e) => {
        e.preventDefault();
        try {
            const response = await Backend.put(`/wallets/${selectedWallet.id}`, { name, type })
            setSelectedWallet(response.data.data);
            history.push('/walletView');
        } catch(err) {history.push("/session");}
    }

    return (
        <div>
            <div>
            <Header title="Edit Wallet" />
            <form>
                <br />
                <h4 className="text-center display-4">Editing: {selectedWallet.name}</h4>
                <div className="form-group">
                    <label>Name</label>
                    <input value={name} onChange={e=>setName(e.target.value)} type="text" required className="form-control" id="name" />
                </div>
                <div className="form-group">
                    <label>Transaction Type</label>
                    <select value={type} onChange={e=>setType(e.target.value)} required className="custom-select" id="type">
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                    </select>
                </div>
                <button onClick={handleEditWallet} className="btn btn-primary">Submit</button><br />
            </form>
        </div>
        </div>
    )
}

export default EditWallet