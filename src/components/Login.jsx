import React, {useState} from "react";
import ContentCard from "./Cards/ContentCard";
import Button from "./Custom/Button";
import './Login.css';

function Login()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here, e.g., API call to authenticate user
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return(
        <div className="login-container p-1">
            <ContentCard className="login-card">
                <form className="login-form px-4" onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control login-input"
                            id="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* PASSWORD */}
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control login-input"
                            id="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <Button type="submit" className="login-button btn btn-primary w-100 mb-3">Log in</Button>
                    
                    {/* Redirect to registeration page */}
                    <div className="text-center">
                        <p>Don't have an account? <a href="/registration">Register</a></p>
                    </div>
                </form>
            </ContentCard>
        </div>
    );
}

export default Login;