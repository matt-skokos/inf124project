import React from 'react'; 
import { Link } from 'react-router-dom'; 
import './Navbar.css'

function Navbar(){
    return (
        <header className='navbar'>
            <nav className='navbar-content'>
                <div className='navbar-logo'>
                    {/*TODO: replace with site logo */}
                    <h1 className='navbar-logo-text'>LocalLengend</h1>
                </div>

                <ul className='navbar-links'>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/forecast'>Forecast</Link></li>
                    <li><Link to='/explore'>Explore</Link></li>
                    <li><Link to='/favorites'>Favorites</Link></li>
                </ul>

                <div className='navbar-user-icon'>
                    {/* TODO: replace with profile icon */}
                    <p>profile</p>
                </div>
            </nav>
        </header>
    );
}

export default Navbar