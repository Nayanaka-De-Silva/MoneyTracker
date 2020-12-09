import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Backend from '../../apis/Backend';
import { WalletContext } from '../../context/WalletContext';
import Wallet from './Wallet';

const Wallets = () => {
    const history = useHistory();
    const { wallets, setWallets } = useContext(WalletContext);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await Backend.get("/wallets");
                setWallets(response.data.data)
            } catch(err) {
                history.push("/session");
            }
        }
        fetchData();
    },[history, setWallets])

    return (
        <div className="container">
            <div className="text-left display-4">Wallets</div> <br />
            <div className="d-flex justify-content-around">
                <div className="row">
                    {wallets && wallets.map(wallet => {
                        return (
                            <Wallet key={wallet.id} wallet={wallet} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Wallets;