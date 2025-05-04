import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Explore from "./components/explore/explore";

function App() {
  return (
    // BrowserRouter Wraps entire app to keep UI in sync with URL
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          {/* Add other routes here: Forecast, Explore Spots, Favorites */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
