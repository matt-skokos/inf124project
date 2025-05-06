import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
// import './HeroLogo.css'; // Optional: Add custom styles in a CSS file

const HeroLogo = () => {
  return (
    <div className="w-100 text-center logo-row">
      <Link to="/">
        <img src={logo} className="navbar-logo" alt="Local Legend Logo" />
      </Link>
      <div className="logo-underline"></div>
    </div>
  );
};

export default HeroLogo;
