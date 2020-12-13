import React from 'react';
import { useHistory } from 'react-router-dom';
import Categories from '../components/main/Categories';
import Header from '../components/Header';
import Wallets from '../components/main/Wallets';
import Budget from '../components/main/Budget';

const Home = () => {
    const history = useHistory();

    const handleAddWallet = (e) => {
        e.preventDefault();
        history.push("/addWallet");
    }

    const goToCategory = () => {
        history.push("/categoryView")
    }

    return (
        <div className="container">
            <button onClick={e=>history.push("/")} className="btn btn-primary mt-1">Logout</button>
            <Header title="Welcome back" />
            <div className="container">
                <div className="row">
                    <Wallets />
                </div>
                <div className="row">
                    <div onClick={handleAddWallet} className="btn btn-primary ml-3">Add Wallet</div>
                </div>
                <div className="row">
                    <Budget />
                </div>
                <div className="row">
                    <Categories />
                </div>
                <div className="row">
                    <button className="btn btn-primary ml-3 mb-2" onClick={goToCategory}>View Details</button>
                </div>
            </div>
        </div>
    )
}

export default Home;