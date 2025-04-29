import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home'; 
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    // BrowserRouter Wraps entire app to keep UI in sync with URL
    <BrowserRouter>
      <div className='app-container'>
        <Navbar/>

        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>} />
          {/* Add other routes here: Forecast, Explore Spots, Favorites */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
