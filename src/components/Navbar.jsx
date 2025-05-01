import React from 'react'; 
import { Link, useLocation } from 'react-router-dom'; 
import logo from '../assets/logo.png'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import './Navbar.css'; 


function MobileNavbar(props)
{
    return(
        <div className='mobile-nav d-lg-none'>
            <div className={`d-flex ${props.hideTopRow ? 'justify-content-center' : 'justify-content-between'} align-items-center w-100 py-2`}>
                { !props.hideTopRow && (
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#mobileNavbarNav'
                    aria-controls="mobileNavbarNav"
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                )}

                {/* Logo */}
                <Link className='' to="/">
                    <img 
                        src={logo}
                        className="navbar-logo"
                        alt="Local Legend"
                    />
                </Link>

                {/* profile icon */}
                { !props.hideTopRow && (
                <Link to="/login" className='navbar-profile'>
                    <i class="bi bi-person-circle"></i>
                </Link>
                )}
            </div>

            { !props.hideTopRow && (
            <div className="navbar-collapse justify-content-center alin-items-center w-100 py-2" id="mobileNavbarNav">
                <ul className='navbar-nav'>
                    <li className='nav-item'><Link className='nav-link' to='/'>Home</Link></li>
                    <li className='nav-item'><Link className='nav-link' to='/forecast'>Forecast</Link></li>
                    <li className='nav-item'><Link className='nav-link' to='/explore'>Explore</Link></li>
                    <li className='nav-item'><Link className='nav-link' to='/favorites'>Favorites</Link></li>
                </ul>
            </div>
            )}
        </div>


    );
}

function DesktopNavbar()
{
    return(
        <div className='desktop-nav'>
            <div className="d-none d-lg-flex justify-content-center alin-items-center w-100 py-2">
                <ul className='navbar-nav'>
                    <li className='nav-item'><Link className='nav-link' to='/'>Home</Link></li>
                    <li className='nav-item'><Link className='nav-link' to='/forecast'>Forecast</Link></li>
                    <li className='nav-item'><Link className='nav-link' to='/explore'>Explore</Link></li>
                    <li className='nav-item'><Link className='nav-link' to='/favorites'>Favorites</Link></li>
                </ul>

                {/* profile icon */}
                <Link to="/login" className='navbar-profile'>
                    <i class="bi bi-person-circle"></i>
                </Link> 
            </div>

            {/* ---Logo Row---- */}
            <div className='logo-row d-none d-lg-block w-100 text-center'>
                {/* Logo */}
                <Link to="/">
                    <img 
                        src={logo}
                        className="navbar-logo"
                        alt="Local Legend Logo"
                    />
                </Link>
            </div>
        </div>
    );
}

function Navbar(){

    const {pathname} = useLocation(); // Get the current location
    const hideTopRow = ['/login', '/register'].includes(pathname); // Check if the current path is login or registration
    
    return (
        <nav className='navbar navbar-expand-lg'>
            <div className='container flex-column'>

                <MobileNavbar
                    hideTopRow = {hideTopRow}
                />

                { !hideTopRow && (
                    <DesktopNavbar/>
                )}

                {/* Underline */}
                <div className='logo-underline'></div>

            </div>
        </nav>
    );
}

export default Navbar