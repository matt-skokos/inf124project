import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import ContentCard from "./Custom/ContentCard";
import PageContainer from "./Custom/PageContainer";
import Button from "./Custom/Button";
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // sign in via Firebase Auth
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      // force‐refresh to guarantee a valid token
      const idToken = await user.getIdToken(/* forceRefresh= */ true);
      localStorage.setItem("ID_TOKEN", idToken);
      localStorage.setItem("UID", user.uid); // Store UID for profile and other user-specific requests
      console.log(`Logged in as ${user.email}`);
      navigate("/"); // or wherever your app's home is
    } catch (err) {
      console.error("Login failed", err);
      setError(err.message || "Login error");
    }
  };

  return (
    <PageContainer>
      <ContentCard>
        <h2 className="text-center mb-4">Log In</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid mb-3">
            <Button type="submit">Log In</Button>
          </div>
          <div className="text-center">
            <p>
              Don't have an account? <a href="/registration">Register</a>
            </p>
          </div>
        </form>
      </ContentCard>
    </PageContainer>
  );
}

export default Login;
