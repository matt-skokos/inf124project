import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

function MobileNavbar(props) {
  return (
    <div className="mobile-nav d-lg-none">
      <div
        className={`d-flex ${
          props.hideTopRow
            ? "justify-content-center"
            : "justify-content-between"
        } align-items-center w-100 py-2`}
      >
        {!props.hideTopRow && (
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mobileNavbarNav"
            aria-controls="mobileNavbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {/* Logo */}
        <Link className="" to="/" aria-label="Local Legend icon">
          <img src={logo} className="navbar-logo" alt="Local Legend" />
        </Link>

        {/* profile icon */}
        {!props.hideTopRow && (
          <Link to="/profile" className="navbar-profile" aria-label="profile icon">
            <i className="bi bi-person-circle"></i>
          </Link>
        )}
      </div>

      {!props.hideTopRow && (
        <div
          className="collapse navbar-collapse justify-content-center alin-items-center w-100 py-2"
          id="mobileNavbarNav"
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
      )}
    </div>
  );
}

function DesktopNavbar(props) {
  return (
    <div className="desktop-nav">
      {!props.hideTopRow && (
        <div className="d-none d-lg-flex justify-content-center alin-items-center w-100 py-2">
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

          {/* profile icon */}
          <Link to="/login" className="navbar-profile" aria-label="profile icon">
            <i className="bi bi-person-circle"></i>
          </Link>
        </div>
      )}

      {/* ---Logo Row---- */}
      <div className="logo-row d-none d-lg-block w-100 text-center">
        {/* Logo */}
        <Link to="/" aria-label="Local Legend icon">
          <img src={logo} className="navbar-logo" alt="Local Legend Logo" />
        </Link>
      </div>
    </div>
  );
}

function Navbar() {
  const { pathname } = useLocation(); // Get the current location
  const hideTopRow = ["/login", "/registration"].includes(pathname); // Check if the current path is login or registration

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container flex-column">
        <MobileNavbar hideTopRow={hideTopRow} />

        <DesktopNavbar hideTopRow={hideTopRow} />

        {/* Underline */}
        <div className="logo-underline"></div>
      </div>
    </nav>
  );
}

export default Navbar;