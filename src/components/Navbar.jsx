import React from 'react'; 
import { Link } from 'react-router-dom'; 


function Navbar(){
    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom'>
            <div className='container'>
                
                {/* Logo */}
                <Link className='navbar-brand fw-bold' to='/'>
                    {/*TODO: replace with site logo */}
                    Local Legend
                </Link>

                {/* Toggle for mobile view */}
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNav'
                    aria-controls="navbarNav"
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>

                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                        <li className='nav-item'><Link className='nav-link' to='/'>Home</Link></li>
                        <li className='nav-item'><Link className='nav-link' to='/forecast'>Forecast</Link></li>
                        <li className='nav-item'><Link className='nav-link' to='/explore'>Explore</Link></li>
                        <li className='nav-item'><Link className='nav-link' to='/favorites'>Favorites</Link></li>
                    </ul>
                </div>

                <span className='navbar-profile-icon'>
                    {/* TODO: replace with profile icon */}
                    <p>profile</p>
                </span>


            </div>
        </nav>
    );
}

export default Navbar