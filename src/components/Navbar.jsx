import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container flex-column">
        {/* First row: links + toggler + profile */}
        <div className="d-flex w-100 justify-content-center align-items-center py-2">
          {/* Toggle for mobile view */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* nav-links (collapse on small screens) */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/forecast">
                  Forecast
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/explore">
                  Explore
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* profile icon always visible */}
          <Link to="/login" className="navbar-profile ">
            <i class="bi bi-person-circle"></i>
          </Link>
        </div>

        {/* Second row: Logo + underline */}
        {/* We should probably not include this in the Navbar and serve it as a separate Hero section */}
        <div className="w-100 text-center logo-row">
          {/* Logo */}
          <Link to="/">
            <img src={logo} className="navbar-logo" alt="Local Legend Logo" />
          </Link>

          {/* Underline */}
          <div className="logo-underline"></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
