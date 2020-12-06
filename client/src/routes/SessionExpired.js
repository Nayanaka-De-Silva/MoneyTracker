import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';

const SessionExpired = () => {
    const history = useHistory();

    useEffect(()=>{
        setTimeout(()=>history.push("/"), 3000);
    }, [history])

    return (
        <div>
            <Header title="Session Expired"/>
            <h3 className="text-center display-4">Please login again</h3>
        </div>
    )
}

export default SessionExpired;