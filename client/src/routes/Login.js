import React, { useEffect } from 'react'
import Backend from '../apis/Backend'
import Header from '../components/Header'
import LoginForm from '../components/entry/LoginForm'

const Login = () => {
    useEffect(()=>{
        const fetchData = async () => {
            try {
                await Backend.get("/logout");
            } catch(err) {console.log(err)}
        }
        fetchData();
    },[])

    return (
        <div className="container">
            <Header title="MoneyTracker" />
            <LoginForm />
        </div>
    )
}

export default Login;