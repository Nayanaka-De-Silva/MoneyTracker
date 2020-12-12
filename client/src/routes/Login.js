import React, { useEffect } from 'react'
import Backend from '../apis/Backend'
import Header from '../components/Header'
import LoginForm from '../components/entry/Login/LoginForm'

const Login = () => {
    useEffect(()=>{
        const fetchData = async () => {
            try {
                await Backend.get("/users/logout");
            } catch(err) {console.log(err)}
        }
        fetchData();
    },[])

    return (
        <div>
            <Header title="MoneyTracker" />
            <LoginForm />
        </div>
    )
}

export default Login;