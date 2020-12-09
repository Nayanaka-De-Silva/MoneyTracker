import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Backend from '../../apis/Backend'

const RegisterForm = () => {
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleRegister = (e) => {
        e.preventDefault();
        const fetchData = async () => {
            try {
                const response = await Backend.post("/users/register", { username,password,confirmPassword })
                if (response.data.status === "Success"){
                    history.push("/");
                }
                else {
                    setErrorMessage("Error: " + response.data.data);
                    setTimeout(()=>setErrorMessage(null), 3000);
                }
            } catch(err){console.log(err)}
        }
        fetchData();
    }

    return (
        <div className="container container-md w-75">
            <form>
                <br />
                <h3 className="text-center">Register</h3>
                <div className="form-group">
                    <label>Username</label>
                    <input value={username} onChange={e=>setUsername(e.target.value)} type="text" required className="form-control" id="username" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="form-control" id="password" />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type="password" required className="form-control" id="confirmPassword" />
                </div>
                <button onClick={handleRegister} className="btn btn-primary mt-3">Register</button>
                {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div>:null}
            </form>
        </div>
    )
}

export default RegisterForm;