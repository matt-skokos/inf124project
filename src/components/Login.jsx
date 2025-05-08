import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import PageContainer from "./Custom/PageContainer";
import Button from "./Custom/Button";
import './Login.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here, e.g., API call to authenticate user
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <PageContainer>
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
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <Button type="submit" className="get-report-button">
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
