import React from 'react';
import {useHistory} from 'react-router-dom';

const TransHeader = ({ current_balance, handleDelete }) => {
    const history = useHistory()

    

    return (
            <div className="container p-1">
                <div className="row justify-content-between">
                    <div className="col-sm-1">
                        <button onClick={()=>history.push("/home")}className="btn btn-primary">Back</button>
                    </div>
                    <div className="col-sm-3">
                        <h3 className="text-left h5">Current Balance: ${current_balance}</h3>
                    </div>
                    <div className="col-sm-1 text-right">
                        <button onClick={()=>history.push('/editWallet')} className="btn btn-warning mb-1">Edit</button>
                    </div>
                    <div className="col-sm-1 text-right">
                        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
    )
}

export default TransHeader