import React from 'react'
import Header from '../components/Header'
import RegisterForm from '../components/entry/Register/RegisterForm'


const Register = () => {
    return (
        <div>
            <Header title="Money Tracker"  />
            <RegisterForm />
        </div>
    )
}

export default Register;