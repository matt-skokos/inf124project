import React, {useState} from "react";
import ContentCard from "./Cards/ContentCard";

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
        <div className="justify-content-center align-items-center d-flex vh-100">
            <ContentCard>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                    <div className="text-center">
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </form>
            </ContentCard>
        </div>
    );
}

export default Login;