import React, { createContext, useState } from 'react';

export const WalletContext = createContext();

export const WalletContextProvider = props => {
    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState({});
    const [selectedTransaction, setSelectedTransaction] = useState("");
    const [categories, setCategories] = useState([]);

    const addWallet = (wallet) => {
        setWallets([ ...wallets, wallet ])
    }
    const addCategory = (category) => {
        setCategories([ ...categories, category ])
    }

    return (
        <WalletContext.Provider value={{ wallets, 
                                        setWallets, 
                                        addWallet, 
                                        selectedWallet, 
                                        setSelectedWallet, 
                                        selectedTransaction, 
                                        setSelectedTransaction,
                                        categories,
                                        setCategories,
                                        addCategory,
                                        }}>
            {props.children}
        </WalletContext.Provider>
    )
}