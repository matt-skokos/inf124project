import React, {useState} from "react";
import ContentCard from "./Cards/ContentCard";
import './Registration.css';

function Registration() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here, e.g., API call to create user
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Email:", email);
        console.log("Password:", password);
    }

    return(
        <div className="registration-container p-1">
            <ContentCard>
                <form className="register-form" onSubmit={handleSubmit}>

                    <div className="mb-3 d-flex gap-2">
                        <input  
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

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
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmpassword"
                            placeholder="confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
                    <div className="text-center">
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
                </form>
            </ContentCard>
        </div>
    )
};

export default Registration;