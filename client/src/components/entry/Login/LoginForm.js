import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Backend from '../../../apis/Backend'

const LoginForm = () => {
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await Backend.post("/users/login", { username, password })
            history.push("/home");
        } catch(err) {
            setErrorMessage("Login failed. Please check your username and password and try again.");
            setTimeout(()=>setErrorMessage(null), 3000);
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();
        history.push("/register");
    }

    return (
            <form>
                <br />
                <h3 className="text-center">Login</h3>
                <div className="container-md">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label>Username</label>
                                <input value={username} onChange={e=>setUsername(e.target.value)} type="text" required className="form-control" id="username" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="form-control" id="password" />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <button onClick={handleLogin} className="btn btn-primary mt-1">Login</button><br />
                            <button onClick={handleRegister} className="btn btn-primary mt-1">Register</button>
                        </div>
                    </div>
                </div>
                {errorMessage ? <div className="alert alert-danger mb-2" role="alert">{errorMessage}</div>:null}
            </form>
    )
}

export default LoginForm;