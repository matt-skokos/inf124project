// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Footer from './components/Custom/Footer';
import Home from './components/Home';
import Forecast from './components/Forecast';
import Login from './components/Login';
import Registration from './components/Registration';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import Explore from "./components/explore/explore";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/forecast-forum" element={<ForecastForum />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* Add other routes here: Forecast, Explore Spots, Favorites */}
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;