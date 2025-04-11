import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home'
import About from './components/About'

import './App.css';

function App() {
  return (
    // BrowserRouter Wraps entire app to keep UI in sync with URL
    <BrowserRouter>
      <div className='App'>
        {/* Navigation Menu */}
        <header className='App-header'>
          <nav className='App-nav'>
            <ul>
              {/* Link used to create naviation links without reloading page */}
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
          <h1>Local Legend</h1>
        </header>

        {/* Define Routes */}
        {/* Routes(v6) replaces older Switch component */}
        <Routes>
          {/* Each Route element defines mapping bewteen URL path and corresponding components */}
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
