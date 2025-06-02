import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentCard from "./Custom/ContentCard";
import PageContainer from "./Custom/PageContainer";
import Button from "./Custom/Button";
import './Login.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here, e.g., API call to authenticate user
    console.log("Email:", email);
    console.log("Password:", password);

    try{
      // Sign in with Firebase Auth REST API
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: "POST", 
          headers: {"Content-Type": "application/json"}, 
          body: JSON.stringify({
            email, 
            password, 
            returnSecureToken: true,
          }),
        }
      );

      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error.message || "Login Failed")
      }

      // Store ID token for authenticated requests
      localStorage.setItem("ID_TOKEN", data.idToken);

      // Store UID for viewing and updating profile request
      localStorage.setItem("UID", data.localId)

      // redirect users back to home page
      navigate("/");

    }catch(err){
      console.log(err);  
      alert(err.message);
    }
  };

  return (
    <PageContainer title="Log In">
      <ContentCard>
        <form className="login-form" onSubmit={handleSubmit}>
          
          {/* EMAIL */}
          <div className="mb-3">
            <label className="visually-hidden" htmlFor="email">
              Email
            </label>
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
            <label className="visually-hidden" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              autoComplete="on"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <Button type="submit">
            Login
          </Button>
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
