import React, { useEffect, useState } from "react";
// import Navbar from "../navbar/navbar";
import "./explore.css";

const spots = [
  {
    imgURL: "https://source.unsplash.com/random/150x150?surf",
    title: "Sunset Cliffs",
    description:
      "A scenic coastal location with stunning sunset views and rugged cliffs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec risus quam. Sed id nunc nec lorem malesuada luctus. Aenean bibendum nulla sed finibus egestas. ",
    skillLevel: "Beginner",
  },
  {
    imgURL: `https://source.unsplash.com/150x150/?surf&sig=${Math.random()}`,
    title: "Black's Beach",
    description:
      "A peaceful hiking trail leads down to a natural reserve sand break. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec risus quam. Sed id nunc nec lorem malesuada luctus. Aenean bibendum nulla sed finibus egestas. ",
    skillLevel: "Intermediate",
  },
  {
    imgURL: "https://source.unsplash.com/150x150/?beach,cliff,coast",
    title: "Tourmaline Street",
    description:
      "An easy access beach break and point break with parking and showers.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec risus quam. Sed id nunc nec lorem malesuada luctus. Aenean bibendum nulla sed finibus egestas. ",
    skillLevel: "Beginner",
  },
];

function onToggleSpot() {}

const Explore = () => {
  // useEffect to fetch API data for spots
  useEffect(() => {
    // fetch images
    const randomBeachImages = [
      `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`,
      `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`,
      `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`,
    ];
    // update json
    const updatedSpot = spots.map((spot, i) => ({
      ...spot,
      imgURL: randomBeachImages[i],
    }));

    onFetchSpots(updatedSpot);
  }, []);

  const [spotList, onFetchSpots] = useState(spots);
  return (
    <div className="container">
      <div className="explore-page">
        <h1>Explore Spots</h1>
        {/* {Explore Spots items here} */}
        <ul>
          {spotList.map((spot) => (
            <li className="content-card" key={spot.title}>
              <Spot {...spot} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Explore;

const Spot = ({ imgURL, title, description, skillLevel }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "1rem",
      }}
    >
      <div className="imageWrapper">
        <img src={imgURL} alt={title} className="spotImage" />
      </div>
      <div>
        <h2 className="title">{title}</h2>
        <p>{description}</p>
        <h3 className="skill">
          <strong>Skill Level: </strong>
          {skillLevel}
        </h3>
      </div>
    </div>
  );
};
