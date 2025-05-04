// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Custom/Footer';
import Home from './components/Home';
import ForecastForum from './components/ForecastForum';
import Login from './components/Login';
import Registration from './components/Registration';
import Profile from './components/Profile';
import Favorites from './components/favorites';

function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <Navbar />

        <div className='main-content'>
          <Routes>
            <Route path='/'                 element={<Home/>}/>
            <Route path='/login'            element={<Login/>}/>
            <Route path='/registration'     element={<Registration/>}/>
            <Route path='/profile'          element={<Profile/>}/>
            <Route path='/forecast-forum'   element={<ForecastForum/>}/>
+           <Route path='/favorites'        element={<Favorites />}/>  
            {/* Add other routes here: Forecast, Explore Spots, Favorites */}
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
