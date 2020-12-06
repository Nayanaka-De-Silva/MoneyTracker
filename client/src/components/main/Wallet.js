import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBill, faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import { WalletContext } from '../../context/WalletContext'
import { useHistory } from 'react-router-dom'

const typeColor = {
    Cash: "card text-white bg-success mb-3 mr-1",
    Bank: "card text-white bg-primary mb-3 mr-1"
}

const typeIcon = {
    Cash: <FontAwesomeIcon  icon={faMoneyBill}/>,
    Bank: <FontAwesomeIcon  icon={faPiggyBank}/>
}


const Wallet = ({ wallet}) => {
    const history = useHistory();
    const { setSelectedWallet } = useContext(WalletContext);

    const handleWallet = (wallet) => {
        setSelectedWallet(wallet);
        history.push("/walletView");
    }
    

    return (
        <div className="col-md-auto">
            <div onClick={()=>handleWallet(wallet)} className={typeColor[wallet.type]} >
                <div className="card-header text-center table-hover"><h4>{typeIcon[wallet.type]} {wallet.name}</h4></div>
                <div className="card-body">
                    <h6 className="card-title text-center">Current Balance: <strong>${wallet.current_balance}</strong></h6>
                </div>
            </div>
        </div>
    )
}

export default Wallet;