// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from './components/Custom/Footer';
import Home from './components/Home';
import Forecast from './components/Forecast';
import Login from './components/Login';
import Registration from './components/Registration';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import Explore from "./components/Explore";
import PrivateRoute from "./components/Custom/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar/>

        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />

            {/* Private Routes */}
            {/* If no ID_TOKEN → Redirect to "/" */}
            <Route element={<PrivateRoute/>}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/forecast" element={<Forecast/>} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>

          </Routes>
        </div>

        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;