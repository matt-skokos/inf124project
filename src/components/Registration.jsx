import React, {useState} from "react";
import ContentCard from "./Custom/ContentCard";
import PageContainer from "./Custom/PageContainer";
import Button from "./Custom/Button";
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
        console.log("Confirm password:", confirmPassword);
    }

    return(
        <PageContainer title="Register">
            <ContentCard className="registration-card">
                <form className="registration-form" onSubmit={handleSubmit}>

                    {/* USER NAME  */}
                    <div className="mb-3 d-flex gap-2">
                        {/* FIRST NAME  */}
                        <label className="visually-hidden" htmlFor="first-name">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="first-name"
                            placeholder="first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />

                        {/* LAST NAME */}
                        <label className="visually-hidden" htmlFor="last-name">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="last-name"
                            placeholder="last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    {/* EMAIL  */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="email">Email</label>
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

                    {/* PASSWORD */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="password">Password</label>
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

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirm-password"
                            placeholder="confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* SUBMIT BUTTON  */}
                    <Button type="submit" className="registration-button btn btn-primary w-100 mb-3">Register</Button>
                    
                    {/* Redicit to login page */}
                    <div className="text-center">
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
                </form>
            </ContentCard>
        </PageContainer>
    )
};

export default Registration;