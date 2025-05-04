import React from "react";
// import Navbar from "../navbar/navbar";
import "./explore.css";
import Navbar from "../Navbar";

const spots = [
  {
    img_url: "https://example.com/images/spot1.jpg",
    title: "Sunset Cliffs",
    description:
      "A scenic coastal location with stunning sunset views and rugged cliffs.",
    skill_level: "Beginner",
  },
  {
    img_url: "https://example.com/images/spot2.jpg",
    title: "Forest Trail",
    description:
      "A peaceful hiking trail surrounded by lush greenery and wildlife.",
    skill_level: "Intermediate",
  },
  {
    img_url: "https://example.com/images/spot3.jpg",
    title: "Rocky Ridge",
    description:
      "A challenging climbing spot with breathtaking panoramic views.",
    skill_level: "Advanced",
  },
];

const Explore = () => {
  return (
    <div className="container">
      <div className="explore-page">
        <h1>Explore Spots</h1>
      </div>
    </div>
  );
};

export default Explore;
